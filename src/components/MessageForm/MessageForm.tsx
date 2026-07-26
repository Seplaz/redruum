import styles from "./MessageForm.module.css";
import Input from "../Input/Input";

const MAX_LENGTH = 1000;

type MessageFormProps = {
  value: string;
  onChange: (value: string) => void;
};

const MessageForm = ({ value, onChange }: MessageFormProps) => {
  return (
    <div className={styles.form}>
      <Input
        value={value}
        onChange={onChange}
        multiline
        autoFocus
        maxLength={MAX_LENGTH}
        placeholder="Что хочется написать прямо сейчас?"
        inputMode="text"
        enterKeyHint="send"
      />
    </div>
  );
};

export default MessageForm;
