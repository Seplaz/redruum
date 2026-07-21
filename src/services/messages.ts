import { supabase } from "../lib/supabase";
import type { Message } from "../types/message";

export const getMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
};

export const createMessage = async (text: string) => {
  const { error } = await supabase.from("messages").insert({ text });

  if (error) {
    throw error;
  }
};
