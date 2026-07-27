import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import styles from "./Content.module.css";

import Title from "../Title/Title";
import MessageList from "../MessageList/MessageList";
import MessageThread from "../MessageThread/MessageThread";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import MessageForm from "../MessageForm/MessageForm";

import pencilIcon from "../../assets/icons/pencil.svg";
import sendIcon from "../../assets/icons/send.svg";

import type { Message } from "../../types/message";

import { createMessage, getMessages } from "../../services/messages";
import { createComment } from "../../services/comments";
import { supabase } from "../../lib/supabase";
import { useComments } from "../../hooks/useComments";

import Status from "../Status/Status";
import { useStatus } from "../../hooks/useStatus";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { checkSendCooldown, markSent } from "../../utils/checkSendCooldown";

const MIN_SEND_INTERVAL_MS = 20_000;
const LAST_MESSAGE_SENT_KEY = "lastMessageSentAt";
const LAST_COMMENT_SENT_KEY = "lastCommentSentAt";
const COOLDOWN_STATUS_DURATION = 4000;

const getCooldownText = (seconds: number) => {
  return `Не так быстро. Подождите ${seconds} сек.`;
};

const Content = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [commentText, setCommentText] = useState("");

  const [newMessageId, setNewMessageId] = useState<number | null>(null);

  const { status, showStatus, hideStatus } = useStatus();
  const commentsByMessage = useComments(showStatus);

  const commentCounts = useMemo(() => {
    return Object.fromEntries(
      Object.entries(commentsByMessage).map(([id, list]) => [id, list.length]),
    );
  }, [commentsByMessage]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error(error);
        showStatus(getErrorMessage(error));
      }
    };

    loadMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        ({ new: message }) => {
          const newMessage = message as Message;

          setMessages((previous) => [newMessage, ...previous]);
          setNewMessageId(newMessage.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showStatus]);

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text) return;

    const remainingSeconds = checkSendCooldown(
      LAST_MESSAGE_SENT_KEY,
      MIN_SEND_INTERVAL_MS,
    );

    if (remainingSeconds > 0) {
      showStatus(
        getCooldownText(remainingSeconds),
        "info",
        COOLDOWN_STATUS_DURATION,
      );
      return;
    }

    try {
      await createMessage(text);

      markSent(LAST_MESSAGE_SENT_KEY);
      setMessageText("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      showStatus(getErrorMessage(error));
    }
  };

  const handleSendComment = async () => {
    if (!selectedMessage) return;

    const text = commentText.trim();
    if (!text) return;

    const remainingSeconds = checkSendCooldown(
      LAST_COMMENT_SENT_KEY,
      MIN_SEND_INTERVAL_MS,
    );

    if (remainingSeconds > 0) {
      showStatus(
        getCooldownText(remainingSeconds),
        "info",
        COOLDOWN_STATUS_DURATION,
      );
      return;
    }

    try {
      await createComment(selectedMessage.id, text);

      markSent(LAST_COMMENT_SENT_KEY);
      setCommentText("");
    } catch (error) {
      console.error(error);
      showStatus(getErrorMessage(error));
    }
  };

  const handleCloseThread = () => {
    setSelectedMessage(null);
    setCommentText("");
  };

  return (
    <div className={styles.content}>
      <motion.div className={styles.messages}>
        <div className={styles.title_container}>
          <Title>
            Делись тем,
            <br />о чём молчишь
          </Title>
        </div>
        <MessageList
          messages={messages}
          onMessageClick={setSelectedMessage}
          newMessageId={newMessageId}
          commentCounts={commentCounts}
        />
      </motion.div>

      <motion.div
        className={styles.write_button}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button icon={pencilIcon} onClick={() => setIsModalOpen(true)} />
      </motion.div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <MessageForm value={messageText} onChange={setMessageText} />
            <Button
              icon={sendIcon}
              text="Отправить"
              iconPosition="end"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            />
          </>
        }
      />

      <Modal
        open={selectedMessage !== null}
        onClose={handleCloseThread}
        footer={
          selectedMessage && (
            <>
              <MessageForm
                value={commentText}
                onChange={setCommentText}
                placeholder="Ответить..."
                autoFocus={false}
              />
              <Button
                icon={sendIcon}
                text="Отправить"
                iconPosition="end"
                onClick={handleSendComment}
                disabled={!commentText.trim()}
              />
            </>
          )
        }
      >
        {selectedMessage && (
          <MessageThread
            message={selectedMessage}
            comments={commentsByMessage[selectedMessage.id] ?? []}
          />
        )}
      </Modal>

      <Status
        open={status.open}
        text={status.text}
        type={status.type}
        duration={status.duration}
        onClose={hideStatus}
      />
    </div>
  );
};

export default Content;
