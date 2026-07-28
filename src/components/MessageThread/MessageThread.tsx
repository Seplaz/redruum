import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import styles from './MessageThread.module.css';
import { transitions } from '../../animations/transitions';

import type { Message } from '../../types/message';
import type { Comment } from '../../types/comment';

type MessageThreadProps = {
  message: Message;
  comments: Comment[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
};

const INITIAL_ANIMATED_COUNT = 10;
const COMMENTS_START_DELAY = 0.2;
const COMMENT_STEP_DELAY = 0.06;

const MessageThread = ({
  message,
  comments,
  loading,
  hasMore,
  loadMore,
}: MessageThreadProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const previousCommentsCount = useRef(comments.length);

  useEffect(() => {
    if (!hasMore) return;

    const target = loadMoreRef.current;

    if (!target) return;

    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        root: commentsRef.current,
        rootMargin: '200px',
      },
    );

    observer.current.observe(target);

    return () => observer.current?.disconnect();
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const container = commentsRef.current;

    if (!container) return;

    if (comments.length > previousCommentsCount.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }

    previousCommentsCount.current = comments.length;
  }, [comments]);

  return (
    <div className={styles.thread}>
      <motion.p
        className={styles.message}
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: transitions.normal,
        }}
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

        {hasMore && <div ref={loadMoreRef} />}

        {/* {loading && <div className={styles.loading}>Загрузка...</div>} */}
      </div>
    </div>
  );
};

export default MessageThread;
