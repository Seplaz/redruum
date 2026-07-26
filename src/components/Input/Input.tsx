import type { ChangeEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  maxLength?: number;

  multiline?: boolean;

  autoFocus?: boolean;

  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "numeric"
    | "decimal";

  enterKeyHint?:
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
};

const Input = ({
  value,
  onChange,
  placeholder,
  maxLength,
  multiline = false,
  autoFocus = false,
  inputMode = "text",
  enterKeyHint = "done",
}: InputProps) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.input}>
      {multiline ? (
        <TextareaAutosize
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          minRows={1}
          maxRows={8}
        />
      ) : (
        <input
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
        />
      )}

      {typeof maxLength === "number" && (
        <span className={styles.counter}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default Input;
