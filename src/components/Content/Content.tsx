import { useState } from 'react';
import styles from './Content.module.css';
import Title from '../Title/Title';
import MessageList from '../MessageList/MessageList';
import Button from '../Button/Button';
import pencil from '../../assets/icons/pencil.svg';
import Modal from '../Modal/Modal';
import send_icon from '../../assets/icons/send.svg';
import { motion } from 'motion/react';

const Content = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    console.log('Отправляем:', messageText);
    setIsModalOpen(false);
    setMessageText('');
  };

  const messages = [
    {
      id: 1,
      text: 'Сегодня впервые признался себе в том, чего действительно хочу.',
    },
    {
      id: 2,
      text: 'Иногда самые запретные мысли оказываются самыми честными.',
    },
    {
      id: 3,
      text: 'Я поцеловал человека, о котором никому никогда не рассказывал.',
    },
    {
      id: 4,
      text: 'До сих пор вспоминаю ту ночь и улыбаюсь.',
    },
    {
      id: 5,
      text: 'Мне всегда было интересно попробовать то, о чём обычно молчат.',
    },
    {
      id: 6,
      text: 'Однажды я соврал, что всё было идеально. На самом деле — нет.',
    },
    {
      id: 7,
      text: 'Иногда хочется просто рассказать всё незнакомцам и больше никогда об этом не думать.',
    },
    {
      id: 8,
      text: 'Самое смелое решение в моей жизни я принял совершенно спонтанно.',
    },
    {
      id: 9,
      text: 'Я до сих пор храню сообщение, которое давно должен был удалить.',
    },
    {
      id: 10,
      text: 'Есть фантазия, о которой я ещё никому не рассказывал.',
    },
  ];

  return (
    <div className={styles.content}>
      <motion.div className={styles.messages}>
        <Title>
          Делись,
          <br />
          чем хочешь
        </Title>
        <MessageList messages={messages} />
      </motion.div>
      <motion.div
        className={styles.write_button}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button icon={pencil} onClick={() => setIsModalOpen(true)} />
      </motion.div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <textarea
          className={styles.modal_textarea}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder='Расскажи свои тайны...'
        />
        <div className={styles.modal_footer}>
          <Button
            icon={send_icon}
            text={'Отправить'}
            iconPosition={'end'}
            onClick={handleSend}
            disabled={!messageText.trim()}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Content;
