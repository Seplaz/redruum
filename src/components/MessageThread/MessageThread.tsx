import styles from "./MessageThread.module.css";

import type { Message } from "../../types/message";
import type { Comment } from "../../types/comment";

type MessageThreadProps = {
  message: Message;
  comments: Comment[];
};

const MessageThread = ({ message, comments }: MessageThreadProps) => {
  return (
    <div className={styles.thread}>
      <p className={styles.message}>{message.text}</p>
      <div className={styles.comments}>
        {comments.map((comment) => (
          <p key={comment.id} className={styles.comment}>
            {comment.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default MessageThread;
