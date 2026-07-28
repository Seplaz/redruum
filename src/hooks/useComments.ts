import { useCallback, useEffect, useState } from 'react';

import type { Comment } from '../types/comment';

import { COMMENTS_PAGE_SIZE, getComments } from '../services/comments';

import { supabase } from '../lib/supabase';

import { getErrorMessage } from '../utils/getErrorMessage';

export const useComments = (
  messageId: number | null,
  onError?: (text: string) => void,
) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(messageId !== null);
  const [hasMore, setHasMore] = useState(true);

  const [trackedMessageId, setTrackedMessageId] = useState(messageId);

  if (trackedMessageId !== messageId) {
    setTrackedMessageId(messageId);
    setComments([]);
    setNextCursor(null);
    setHasMore(true);
    setLoading(messageId !== null);
  }

  const loadComments = useCallback(
    async (reset = false) => {
      if (!messageId) return;
      if (loading) return;
      if (!reset && !hasMore) return;

      setLoading(true);

      try {
        const { comments: data, nextCursor: cursor } = await getComments(
          messageId,
          reset ? undefined : (nextCursor ?? undefined),
        );

        setComments((previous) => (reset ? data : [...previous, ...data]));

        setNextCursor(cursor);
        setHasMore(data.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        console.error(error);
        onError?.(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [messageId, nextCursor, hasMore, loading, onError],
  );

  useEffect(() => {
    if (!messageId) return;

    let isCancelled = false;

    const fetchInitial = async () => {
      try {
        const { comments: data, nextCursor: cursor } =
          await getComments(messageId);

        if (isCancelled) return;

        setComments(data);
        setNextCursor(cursor);
        setHasMore(data.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        if (isCancelled) return;

        console.error(error);
        onError?.(getErrorMessage(error));
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitial();

    return () => {
      isCancelled = true;
    };
  }, [messageId, onError]);

  useEffect(() => {
    if (!messageId) return;

    const channel = supabase
      .channel(`comments-${messageId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `message_id=eq.${messageId}`,
        },
        ({ new: comment }) => {
          setComments((previous) => [...previous, comment as Comment]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId]);

  return {
    comments,
    loading,
    hasMore,
    loadMore: () => loadComments(false),
  };
};
