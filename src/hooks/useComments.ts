import { useEffect, useState } from "react";
import type { Comment } from "../types/comment";
import { getAllComments } from "../services/comments";
import { supabase } from "../lib/supabase";
import { getErrorMessage } from "../utils/getErrorMessage";

type CommentsByMessage = Record<number, Comment[]>;

export const useComments = (onError?: (text: string) => void) => {
  const [commentsByMessage, setCommentsByMessage] = useState<CommentsByMessage>(
    {},
  );

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getAllComments();

        const grouped = data.reduce<CommentsByMessage>((acc, comment) => {
          const list = acc[comment.message_id] ?? [];
          acc[comment.message_id] = [...list, comment];
          return acc;
        }, {});

        setCommentsByMessage(grouped);
      } catch (error) {
        console.error(error);
        onError?.(getErrorMessage(error));
      }
    };

    loadComments();

    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        ({ new: comment }) => {
          const newComment = comment as Comment;

          setCommentsByMessage((previous) => {
            const list = previous[newComment.message_id] ?? [];
            return {
              ...previous,
              [newComment.message_id]: [...list, newComment],
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onError]);

  return commentsByMessage;
};
