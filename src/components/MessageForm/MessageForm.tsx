import { useMemo } from "react";

import styles from "./MessageForm.module.css";
import Input from "../Input/Input";

import { messagePlaceholders } from "../../constants/placeholders";
import { getRandomItem } from "../../utils/getRandomItem";

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
  placeholder,
  autoFocus = true,
}: MessageFormProps) => {
  const randomPlaceholder = useMemo(
    () => placeholder ?? getRandomItem(messagePlaceholders),
    [placeholder],
  );

  return (
    <div className={styles.form}>
      <p className={styles.title}>Создать REDRUUM</p>
      <Input
        value={value}
        onChange={onChange}
        multiline
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH}
        placeholder={randomPlaceholder}
        inputMode="text"
        enterKeyHint="send"
      />
    </div>
  );
};

export default MessageForm;
