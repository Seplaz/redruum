import type { MouseEvent, ReactNode } from 'react';
import styles from './Modal.module.css';
import Button from '../Button/Button';
import closeIcon from '../../assets/icons/arrow_left.svg';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
};

const Modal = ({ open, onClose, header, children }: ModalProps) => {
  if (!open) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <header className={styles.header}>
        {header ?? <Button icon={closeIcon} text='Назад' onClick={onClose} />}
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Modal;
