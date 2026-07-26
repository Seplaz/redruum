import MessageCard from "../MessageCard/MessageCard";
import type { Message } from "../../types/message";
import styles from "./MessageList.module.css";

type MessageListProps = {
  messages: Message[];
  newMessageId: number | null;
  commentCounts: Record<number, number>;
  onMessageClick?: (message: Message) => void;
};

const INITIAL_ANIMATED_COUNT = 10;

const MessageList = ({
  messages,
  newMessageId,
  commentCounts,
  onMessageClick,
}: MessageListProps) => {
  return (
    <div className={styles.message_list}>
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={onMessageClick}
          initial={index < INITIAL_ANIMATED_COUNT}
          order={index}
          isNew={message.id === newMessageId}
          commentsCount={commentCounts[message.id] ?? 0}
        />
      ))}
    </div>
  );
};

export default MessageList;
