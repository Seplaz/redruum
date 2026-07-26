import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import styles from "./MessageThread.module.css";
import { transitions } from "../../animations/transitions";

import type { Message } from "../../types/message";
import type { Comment } from "../../types/comment";

type MessageThreadProps = {
  message: Message;
  comments: Comment[];
};

const INITIAL_ANIMATED_COUNT = 10;
const COMMENTS_START_DELAY = 0.2;
const COMMENT_STEP_DELAY = 0.06;

const MessageThread = ({ message, comments }: MessageThreadProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const container = commentsRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isFirstRender.current ? "auto" : "smooth",
    });

    isFirstRender.current = false;
  }, [comments.length]);

  return (
    <div className={styles.thread}>
      <motion.p
        className={styles.message}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: transitions.normal }}
      >
        {message.text}
      </motion.p>

      <div className={styles.comments} ref={commentsRef}>
        {comments.map((comment, index) => {
          const initial = index < INITIAL_ANIMATED_COUNT;

          return (
            <motion.p
              key={comment.id}
              layout
              className={styles.comment}
              initial={
                initial
                  ? {
                      opacity: 0,
                      y: -20,
                    }
                  : false
              }
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  ...transitions.normal,
                  delay: initial
                    ? COMMENTS_START_DELAY + index * COMMENT_STEP_DELAY
                    : 0,
                },
              }}
              transition={transitions.normal}
            >
              {comment.text}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
};

export default MessageThread;
