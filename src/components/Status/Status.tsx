import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import styles from "./Status.module.css";
import { transitions } from "../../animations/transitions";

import type { StatusType } from "../../types/status";

type StatusProps = {
  open: boolean;
  text: string;
  type: StatusType;
  duration: number;
  onClose: () => void;
};

const Status = ({ open, text, type, duration, onClose }: StatusProps) => {
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(onClose, duration);

    return () => clearTimeout(timeout);
  }, [open, duration, onClose]);

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
