import { useLayoutEffect, useRef, type ChangeEvent } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  useLayoutEffect(() => {
    if (!multiline || !textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value, multiline]);

  return (
    <div className={styles.input}>
      {multiline ? (
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          rows={1}
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
