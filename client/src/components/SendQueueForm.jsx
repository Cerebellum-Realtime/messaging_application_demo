/* eslint-disable react/prop-types */
import { useState } from "react";

const SendQueueForm = ({ user, queue }) => {
  const [queueField, setQueueField] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${queueField}`;
    queue(messageSend);
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
