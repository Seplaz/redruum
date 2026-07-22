import type { ChangeEvent } from 'react';
import styles from './MessageForm.module.css';
import Button from '../Button/Button';
import sendIcon from '../../assets/icons/send.svg';

type MessageFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const MessageForm = ({ value, onChange, onSubmit }: MessageFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        placeholder='Написать...'
        autoFocus
      />

      <footer className={styles.footer}>
        <Button
          icon={sendIcon}
          text='Отправить'
          iconPosition='end'
          onClick={onSubmit}
          disabled={!value.trim()}
        />
      </footer>
    </div>
  );
};

export default MessageForm;
