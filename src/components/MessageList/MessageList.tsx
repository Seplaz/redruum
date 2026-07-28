import { useEffect, useRef } from 'react';

import MessageCard from '../MessageCard/MessageCard';

import type { Message } from '../../types/message';

import styles from './MessageList.module.css';

type MessageListProps = {
  messages: Message[];
  newMessageId: number | null;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onMessageClick?: (message: Message) => void;
};

const INITIAL_ANIMATED_COUNT = 10;

const MessageList = ({
  messages,
  newMessageId,
  loading,
  hasMore,
  loadMore,
  onMessageClick,
}: MessageListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const element = loadMoreRef.current;
    if (!element) return;

    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        rootMargin: '300px',
      },
    );

    observer.current.observe(element);

    return () => observer.current?.disconnect();
  }, [loading, hasMore, loadMore]);

  return (
    <div className={styles.message_list}>
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={onMessageClick}
          initial={index < INITIAL_ANIMATED_COUNT}
          order={index}
          isNew={message.id === newMessageId}
        />
      ))}

      {hasMore && <div ref={loadMoreRef} />}

      {loading && <div className={styles.loading}>Загрузка...</div>}
    </div>
  );
};

export default MessageList;
