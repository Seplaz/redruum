import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import styles from './Content.module.css';

import Title from '../Title/Title';
import MessageList from '../MessageList/MessageList';
import MessageThread from '../MessageThread/MessageThread';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import MessageForm from '../MessageForm/MessageForm';

import pencilIcon from '../../assets/icons/pencil.svg';
import sendIcon from '../../assets/icons/send.svg';

import type { Message } from '../../types/message';

import { createMessage, getMessages } from '../../services/messages';
import { createComment } from '../../services/comments';
import { supabase } from '../../lib/supabase';
import { useComments } from '../../hooks/useComments';

import Status from '../Status/Status';
import { useStatus } from '../../hooks/useStatus';
import { getErrorMessage } from '../../utils/getErrorMessage';

const MIN_SEND_INTERVAL_MS = 20_000;
const LAST_SEND_KEY = 'lastMessageSentAt';

const Content = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [commentText, setCommentText] = useState('');

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
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
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

    const lastSendAt = Number(localStorage.getItem(LAST_SEND_KEY) || '0');
    const now = Date.now();

    if (now - lastSendAt < MIN_SEND_INTERVAL_MS) {
      showStatus('Слишком часто отправляете сообщения, подождите 20 секунд.');
      return;
    }

    try {
      await createMessage(text);

      localStorage.setItem(LAST_SEND_KEY, String(now));
      setMessageText('');
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

    try {
      await createComment(selectedMessage.id, text);
      setCommentText('');
    } catch (error) {
      console.error(error);
      showStatus(getErrorMessage(error));
    }
  };

  const handleCloseThread = () => {
    setSelectedMessage(null);
    setCommentText('');
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
              text='Отправить'
              iconPosition='end'
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
                placeholder='Ответить...'
                autoFocus={false}
              />
              <Button
                icon={sendIcon}
                text='Отправить'
                iconPosition='end'
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

      <Status open={status.open} text={status.text} onClose={hideStatus} />
    </div>
  );
};

export default Content;
