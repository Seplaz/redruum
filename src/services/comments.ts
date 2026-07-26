import { supabase } from "../lib/supabase";
import type { Comment } from "../types/comment";

export const getAllComments = async (): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

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
