import { useEffect, useState } from 'react';
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
import { supabase } from '../../lib/supabase';

const MIN_SEND_INTERVAL_MS = 20_000;
const LAST_SEND_KEY = 'lastMessageSentAt';

const Content = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessageId, setNewMessageId] = useState<number | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error(error);
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
  }, []);

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text) return;

    const lastSendAt = Number(localStorage.getItem(LAST_SEND_KEY) || '0');
    const now = Date.now();

    if (now - lastSendAt < MIN_SEND_INTERVAL_MS) {
      alert('Слишком часто отправляете сообщения, подождите 20 секунд.');
      return;
    }

    try {
      await createMessage(text);

      localStorage.setItem(LAST_SEND_KEY, String(now));
      setMessageText('');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
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
          <Button
            icon={sendIcon}
            text='Отправить'
            iconPosition='end'
            onClick={handleSend}
            disabled={!messageText.trim()}
          />
        }
      >
        <MessageForm value={messageText} onChange={setMessageText} />
      </Modal>

      <Modal
        open={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
      >
        {selectedMessage && <MessageThread />}
      </Modal>
    </div>
  );
};

export default Content;
