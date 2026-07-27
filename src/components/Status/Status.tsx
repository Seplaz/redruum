import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import styles from "./Status.module.css";
import { transitions } from "../../animations/transitions";

type StatusProps = {
  open: boolean;
  text: string;
  onClose: () => void;
};

const AUTO_CLOSE_DELAY = 4000;

const Status = ({ open, text, onClose }: StatusProps) => {
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(onClose, AUTO_CLOSE_DELAY);

    return () => clearTimeout(timeout);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.status}
          initial={{
            opacity: 0,
            y: -48,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -48,
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
