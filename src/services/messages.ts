import { supabase } from '../lib/supabase';
import type { Message } from '../types/message';

export const MESSAGES_PAGE_SIZE = 20;

export const getMessages = async (
  cursor?: string,
): Promise<{
  messages: Message[];
  nextCursor: string | null;
}> => {
  let query = supabase
    .from('messages')
    .select(
      `
      id,
      text,
      created_at,
      comments_count
    `,
    )
    .order('created_at', {
      ascending: false,
    })
    .limit(MESSAGES_PAGE_SIZE);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const nextCursor =
    data.length === MESSAGES_PAGE_SIZE
      ? data[data.length - 1].created_at
      : null;

  return {
    messages: data as Message[],
    nextCursor,
  };
};

export const getMessageById = async (id: number): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      id,
      text,
      created_at,
      comments_count
    `,
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Message | null;
};

export const createMessage = async (text: string) => {
  const { error } = await supabase.from('messages').insert({
    text,
  });

  if (error) {
    throw error;
  }
};
