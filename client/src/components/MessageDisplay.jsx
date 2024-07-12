/* eslint-disable react/prop-types */
import { useState } from "react";
import DisplayMessages from "./DisplayMessages";
import SendMessageForm from "./SendMessageForm";
import SendQueueForm from "./SendQueueForm";
import useChannel from "../customHooks/useChannel";
import usePresence from "../customHooks/usePresence";
import usePresenceListener from "../customHooks/usePresenceListener";

const MessageDisplay = ({ currentChannel, user, toggleLeaveChannel }) => {
  const [messages, setMessages] = useState([]);

  const handleMessage = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      `${data.message} => ${data.sendDescription}`,
    ]);
  };

  const { publish, queue } = useChannel(
    currentChannel,
    setMessages,
    handleMessage
  );

  const { updateUserInfo } = usePresence(currentChannel, { user });

  const { presenceData } = usePresenceListener(currentChannel);

  const handleLeaveChannel = (event) => {
    event.preventDefault();
    setMessages([]);
    toggleLeaveChannel();
  };

  console.log(updateUserInfo);
  return (
    <>
      <div className="channel-info-container">
        <p className="channel-info">Current Channel: {currentChannel}</p>
        <form onSubmit={handleLeaveChannel}>
          <button type="submit">Leave</button>
        </form>
      </div>
      <></>
      {presenceData.map((data) => (
        <div key={data.socketId}>{data.user}</div>
      ))}
      <DisplayMessages messages={messages} />
      <SendMessageForm user={user} publish={publish} />
      <SendQueueForm user={user} queue={queue} />
    </>
  );
};

export default MessageDisplay;
