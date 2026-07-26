import styles from "./MessageForm.module.css";
import Input from "../Input/Input";

const MAX_LENGTH = 200;

type MessageFormProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

const MessageForm = ({
  value,
  onChange,
  placeholder = "Что хочется написать прямо сейчас?",
  autoFocus = true,
}: MessageFormProps) => {
  return (
    <div className={styles.form}>
      <Input
        value={value}
        onChange={onChange}
        multiline
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH}
        placeholder={placeholder}
        inputMode="text"
        enterKeyHint="send"
      />
    </div>
  );
};

export default MessageForm;
