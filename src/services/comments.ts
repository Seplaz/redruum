import { supabase } from "../lib/supabase";
import type { Comment } from "../types/comment";

export const getComments = async (messageId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("message_id", messageId)
    .order("created_at");

  if (error) {
    throw error;
  }

  return data;
};

export const createComment = async (messageId: number, text: string) => {
  const { error } = await supabase.from("comments").insert({
    message_id: messageId,
    text,
  });

  if (error) {
    throw error;
  }
};
