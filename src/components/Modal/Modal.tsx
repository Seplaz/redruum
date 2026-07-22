import type { MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import styles from './Modal.module.css';

import Button from '../Button/Button';
import closeIcon from '../../assets/icons/arrow_left.svg';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
};

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={styles.overlay} onClick={handleOverlayClick}>
          <motion.div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <Button icon={closeIcon} text='Назад' onClick={onClose} />

              {title && <div className={styles.title}>{title}</div>}
            </header>

            <div className={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
