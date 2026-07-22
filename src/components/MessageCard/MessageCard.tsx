import type { Message } from '../../types/message';
import { motion } from 'motion/react';
import styles from './MessageCard.module.css';

type MessageCardProps = {
  message: Message;
  onClick?: (message: Message) => void;
};

const MessageCard = ({ message, onClick }: MessageCardProps) => {
  return (
    <motion.article className={styles.card} onClick={() => onClick?.(message)}>
      <span className={styles.id}>#{message.id}</span>
      <p className={styles.text}>{message.text}</p>
    </motion.article>
  );
};

export default MessageCard;
