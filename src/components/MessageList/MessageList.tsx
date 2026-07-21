import { motion } from 'motion/react';
import MessageCard from '../MessageCard/MessageCard';
import type { Message } from '../../types/message';
import styles from './MessageList.module.css';

type MessageListProps = {
  messages: Message[];
};

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <motion.div className={styles.message_list}>
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </motion.div>
  );
};

export default MessageList;
