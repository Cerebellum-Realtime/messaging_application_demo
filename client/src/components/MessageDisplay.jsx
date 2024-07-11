/* eslint-disable react/prop-types */
import { useState } from "react";
import DisplayMessages from "./DisplayMessages";
import SendMessageForm from "./SendMessageForm";
import SendQueueForm from "./SendQueueForm";
import useChannel from "../customHooks/useChannel";

const MessageDisplay = ({ currentChannel, user, toggleLeaveChannel }) => {
  const [messages, setMessages] = useState([`You joined ${currentChannel}`]);

  const handleMessage = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      `${data.message} => ${data.sendDescription}`,
    ]);
  };

  const { publish, queue, unsubscribe } = useChannel(
    currentChannel,
    setMessages,
    handleMessage
  );

  const handleLeaveChannel = (event) => {
    event.preventDefault();
    setMessages([]);
    toggleLeaveChannel();
  };

  return (
    <>
      <div className="channel-info-container">
        <button onClick={unsubscribe}> click</button>
        <p className="channel-info">Current Channel: {currentChannel}</p>
        <form onSubmit={handleLeaveChannel}>
          <button type="submit">Leave</button>
        </form>
      </div>
      <DisplayMessages messages={messages} />
      <SendMessageForm user={user} publish={publish} />
      <SendQueueForm user={user} queue={queue} />
    </>
  );
};

export default MessageDisplay;
