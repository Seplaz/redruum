import type { ChangeEvent } from 'react';
import styles from './MessageForm.module.css';

const MAX_LENGTH = 1000;

type MessageFormProps = {
  value: string;
  onChange: (value: string) => void;
};

const MessageForm = ({ value, onChange }: MessageFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        placeholder='Что хочется написать прямо сейчас?'
        autoFocus
        maxLength={MAX_LENGTH}
      />
    </div>
  );
};

export default MessageForm;
