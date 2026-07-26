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

const MessageThread = ({ message, comments }: MessageThreadProps) => {
  return (
    <div className={styles.thread}>
      <p className={styles.message}>{message.text}</p>
      <div className={styles.comments}>
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
                  delay: initial ? index * 0.06 : 0,
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
