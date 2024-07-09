/* eslint-disable react/prop-types */
import { socket } from "../socket";
import { useState } from "react";

const SendQueueForm = ({ user, currentChannel }) => {
  const [queueField, setQueueField] = useState("");

  const { channelId, channelName } = currentChannel;

  /*
  {
    ChannelId
    ChannelName
 }
  */
  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${queueField}`;
    socket.emit("message:queue", channelId, channelName, messageSend);
    setQueueField("");
  };

  return (
    <div className="queue">
      <h3>Send thru Queue</h3>
      <form className="send" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message thru Queue"
          value={queueField}
          onChange={(e) => setQueueField(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendQueueForm;
