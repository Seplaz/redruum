import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import styles from './Status.module.css';
import { transitions } from '../../animations/transitions';

export type StatusType = 'success' | 'info' | 'error';

type StatusProps = {
  open: boolean;
  text: string;
  type?: StatusType;
  onClose: () => void;
};

const AUTO_CLOSE_DELAY = 4000;

const Status = ({ open, text, type = 'info', onClose }: StatusProps) => {
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(onClose, AUTO_CLOSE_DELAY);

    return () => clearTimeout(timeout);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`${styles.status} ${styles[type]}`}
          initial={{
            opacity: 0,
            y: -24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -24,
          }}
          transition={transitions.normal}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Status;
