import type { Message } from '../../types/message';
import MessageCard from '../MessageCard/MessageCard';

type MessageDetailsProps = {
  message: Message;
};

const MessageDetails = ({ message }: MessageDetailsProps) => {
  return (
    <>
      <MessageCard message={message} />
    </>
  );
};

export default MessageDetails;
