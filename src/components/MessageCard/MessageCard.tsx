import { motion } from 'motion/react';
import type { Message } from '../../types/message';
import styles from './MessageCard.module.css';
import { transitions } from '../../animations/transitions';

type MessageCardProps = {
  message: Message;
  order: number;
  initial: boolean;
  isNew: boolean;
  onClick?: (message: Message) => void;
};

const MessageCard = ({
  message,
  order,
  initial,
  isNew,
  onClick,
}: MessageCardProps) => {
  return (
    <motion.article
      layout
      className={styles.card}
      onClick={() => onClick?.(message)}
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
          delay: initial ? order * 0.06 : 0,
        },
      }}
      whileTap={{
        scale: 0.9,
        transition: transitions.normal,
      }}
      transition={transitions.normal}
    >
      {isNew && (
        <motion.div
          layoutId={`new-${message.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transitions.normal}
        />
      )}
      <span className={styles.id}>#{message.id}</span>
      <p className={styles.text}>{message.text}</p>
    </motion.article>
  );
};

export default MessageCard;
