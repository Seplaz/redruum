import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import { createMessage, getMessageById } from '../../services/messages';
import { createComment } from '../../services/comments';
import { useMessages } from '../../hooks/useMessages';
import { useComments } from '../../hooks/useComments';

import Status from '../Status/Status';
import { useStatus } from '../../hooks/useStatus';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { checkSendCooldown, markSent } from '../../utils/checkSendCooldown';

const MIN_SEND_INTERVAL_MS = 20_000;

const LAST_MESSAGE_SENT_KEY = 'lastMessageSentAt';
const LAST_COMMENT_SENT_KEY = 'lastCommentSentAt';

const COOLDOWN_STATUS_DURATION = 4000;

const getCooldownText = (seconds: number) =>
  `Не так быстро. Подождите ${seconds} сек.`;

const Content = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { status, showStatus, hideStatus } = useStatus();

  const {
    messages,
    loading: messagesLoading,
    hasMore: messagesHasMore,
    loadMore: loadMoreMessages,
    newMessageId,
  } = useMessages(showStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [commentText, setCommentText] = useState('');

  const numericId = id ? Number(id) : null;

  const [fetchedMessage, setFetchedMessage] = useState<Message | null>(null);

  const selectedMessage = useMemo(() => {
    if (numericId === null) return null;

    const found = messages.find((message) => message.id === numericId);
    if (found) return found;

    if (fetchedMessage?.id === numericId) return fetchedMessage;

    return null;
  }, [numericId, messages, fetchedMessage]);

  useEffect(() => {
    if (numericId === null) return;

    const alreadyLoaded =
      messages.some((message) => message.id === numericId) ||
      fetchedMessage?.id === numericId;

    if (alreadyLoaded) return;

    let isCancelled = false;

    const fetchMessage = async () => {
      try {
        const data = await getMessageById(numericId);

        if (isCancelled) return;

        if (!data) {
          navigate('/404', { replace: true });
          return;
        }

        setFetchedMessage(data);
      } catch (error) {
        if (isCancelled) return;

        console.error(error);
        showStatus(getErrorMessage(error), 'error');
        navigate('/404', { replace: true });
      }
    };

    fetchMessage();

    return () => {
      isCancelled = true;
    };
  }, [numericId, messages, fetchedMessage, navigate, showStatus]);

  const {
    comments,
    loading: commentsLoading,
    hasMore: commentsHasMore,
    loadMore: loadMoreComments,
  } = useComments(selectedMessage?.id ?? null, showStatus);

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
        'info',
        COOLDOWN_STATUS_DURATION,
      );
      return;
    }

    try {
      await createMessage(text);

      markSent(LAST_MESSAGE_SENT_KEY);
      setMessageText('');
      setIsModalOpen(false);

      showStatus('Сообщение отправлено.', 'success');
    } catch (error) {
      console.error(error);
      showStatus(getErrorMessage(error), 'error');
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
        'info',
        COOLDOWN_STATUS_DURATION,
      );
      return;
    }

    try {
      await createComment(selectedMessage.id, text);

      markSent(LAST_COMMENT_SENT_KEY);
      setCommentText('');

      showStatus('Ответ отправлен.', 'success');
    } catch (error) {
      console.error(error);
      showStatus(getErrorMessage(error), 'error');
    }
  };

  const handleOpenThread = (message: Message) => {
    navigate(`/messages/${message.id}`);
  };

  const handleCloseThread = () => {
    setCommentText('');
    navigate('/');
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
          onMessageClick={handleOpenThread}
          newMessageId={newMessageId}
          loading={messagesLoading}
          hasMore={messagesHasMore}
          loadMore={loadMoreMessages}
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
            comments={comments}
            loading={commentsLoading}
            hasMore={commentsHasMore}
            loadMore={loadMoreComments}
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
