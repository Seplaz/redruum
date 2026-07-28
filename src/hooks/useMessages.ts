import { useCallback, useEffect, useState } from 'react';

import type { Message } from '../types/message';
import { MESSAGES_PAGE_SIZE, getMessages } from '../services/messages';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../utils/getErrorMessage';

export const useMessages = (onError?: (text: string) => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [newMessageId, setNewMessageId] = useState<number | null>(null);

  const loadMessages = useCallback(
    async (reset = false) => {
      if (loading) return;
      if (!reset && !hasMore) return;

      setLoading(true);

      try {
        const { messages: data, nextCursor: cursor } = await getMessages(
          reset ? undefined : (nextCursor ?? undefined),
        );

        setMessages((previous) => (reset ? data : [...previous, ...data]));
        setNextCursor(cursor);
        setHasMore(data.length === MESSAGES_PAGE_SIZE);
      } catch (error) {
        console.error(error);
        onError?.(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [nextCursor, hasMore, loading, onError],
  );

  // Первичная загрузка при монтировании: отдельная функция, не переиспользующая
  // loadMessages, чтобы единственным исполняемым до setState действием был await.
  useEffect(() => {
    let isCancelled = false;

    const fetchInitial = async () => {
      try {
        const { messages: data, nextCursor: cursor } = await getMessages();

        if (isCancelled) return;

        setMessages(data);
        setNextCursor(cursor);
        setHasMore(data.length === MESSAGES_PAGE_SIZE);
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
  }, [onError]);

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        ({ new: message }) => {
          const newMessage = message as Message;
          setMessages((previous) => [newMessage, ...previous]);
          setNewMessageId(newMessage.id);
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        ({ new: message }) => {
          const updatedMessage = message as Message;
          setMessages((previous) =>
            previous.map((m) =>
              m.id === updatedMessage.id ? updatedMessage : m,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    loading,
    hasMore,
    loadMore: () => loadMessages(false),
    newMessageId,
  };
};
