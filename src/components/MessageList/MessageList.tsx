import MessageCard from '../MessageCard/MessageCard';
import type { Message } from '../../types/message';
import styles from './MessageList.module.css';

type MessageListProps = {
  messages: Message[];
  newMessageId: number | null;
  onMessageClick?: (message: Message) => void;
};

const INITIAL_ANIMATED_COUNT = 8;

const MessageList = ({
  messages,
  newMessageId,
  onMessageClick,
}: MessageListProps) => {
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
    </div>
  );
};

export default MessageList;
