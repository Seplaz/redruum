import { motion } from 'motion/react';
import MessageCard from '../MessageCard/MessageCard';
import type { Message } from '../../types/message';
import styles from './MessageList.module.css';

type MessageListProps = {
  messages: Message[];
  onMessageClick?: (message: Message) => void;
};

const MessageList = ({ messages, onMessageClick }: MessageListProps) => {
  return (
    <motion.div className={styles.message_list}>
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={onMessageClick}
        />
      ))}
    </motion.div>
  );
};

export default MessageList;
