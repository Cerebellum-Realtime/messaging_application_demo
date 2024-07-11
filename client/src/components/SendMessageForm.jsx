/* eslint-disable react/prop-types */
import { useState } from "react";

const SendMessageForm = ({ user, publish }) => {
  const [messageField, setMessageField] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();
    const messageSend = `${user}: ${messageField}`;
    publish(messageSend);
    setMessageField("");
  };

  return (
    <div>
      <h3>Send directly to DynamoDB</h3>
      <form className="send" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message direct to DB"
          value={messageField}
          onChange={(e) => setMessageField(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendMessageForm;
