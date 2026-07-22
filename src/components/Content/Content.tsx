import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import styles from './Content.module.css';

import Title from '../Title/Title';
import MessageList from '../MessageList/MessageList';
import MessageDetails from '../MessageDetails/MessageDetails';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import MessageForm from '../MessageForm/MessageForm';

import pencilIcon from '../../assets/icons/pencil.svg';

import type { Message } from '../../types/message';

import { createMessage, getMessages } from '../../services/messages';
import { supabase } from '../../lib/supabase';

const Content = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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
        (payload) => {
          setMessages((previous) => [payload.new as Message, ...previous]);
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

    try {
      await createMessage(text);

      setMessageText('');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.content}>
      <motion.div className={styles.messages}>
        <Title>
          Делись тем,
          <br />о чём молчишь
        </Title>

        <MessageList messages={messages} onMessageClick={setSelectedMessage} />
      </motion.div>

      <motion.div
        className={styles.write_button}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button icon={pencilIcon} onClick={() => setIsModalOpen(true)} />
      </motion.div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MessageForm
          value={messageText}
          onChange={setMessageText}
          onSubmit={handleSend}
        />
      </Modal>

      <Modal
        open={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
      >
        {selectedMessage && <MessageDetails message={selectedMessage} />}
      </Modal>
    </div>
  );
};

export default Content;
