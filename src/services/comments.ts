import { supabase } from '../lib/supabase';
import type { Comment } from '../types/comment';

export const COMMENTS_PAGE_SIZE = 20;

export const getComments = async (
  messageId: number,
  cursor?: string,
): Promise<{
  comments: Comment[];
  nextCursor: string | null;
}> => {
  let query = supabase
    .from('comments')
    .select('*')
    .eq('message_id', messageId)
    .order('created_at', {
      ascending: true,
    })
    .limit(COMMENTS_PAGE_SIZE);

  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const nextCursor =
    data.length === COMMENTS_PAGE_SIZE
      ? data[data.length - 1].created_at
      : null;

  return {
    comments: data,
    nextCursor,
  };
};

export const createComment = async (messageId: number, text: string) => {
  const { error } = await supabase.from('comments').insert({
    message_id: messageId,
    text,
  });

  if (error) {
    throw error;
  }
};
