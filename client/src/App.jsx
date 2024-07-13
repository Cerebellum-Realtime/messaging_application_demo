import { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";
import Username from "./components/Username";
import Channel from "./components/Channel";
import SendMessageForm from "./components/SendMessageForm";
import DisplayMessages from "./components/DisplayMessages";
import SendQueueForm from "./components/SendQueueForm";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${data.message} => ${data.sendDescription}`,
      ]);
    };

    if (user) {
      socket.on("connect_error", (reason) => {
        console.log("Authentication failed:", reason.message);
        if (reason.message === "Authentication error") {
          socket.disconnect();
          setUser(null);
        }
      });

      socket.connect();
      socket.on("message:receive", handleMessage);
    }

    return () => {
      socket.off("message:receive", handleMessage);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  const handleUsernameSubmit = (username) => {
    setUser(username);
  };

  const handleJoinChannel = (channelInfo, pastMessages) => {
    setCurrentChannel(channelInfo);
    setMessages([`You joined ${channelInfo.channelName}`].concat(pastMessages));
  };

  const handleLeaveChannel = () => {
    if (currentChannel) {
      setMessages([]);
      setCurrentChannel(null);
    }
  };

  return (
    <div className="container">
      {!user ? (
        <Username toggleUsernameSubmit={handleUsernameSubmit} />
      ) : (
        <>
          <p className="welcome">Welcome, {user}!</p>
          <Channel
            toggleJoinChannel={handleJoinChannel}
            toggleLeaveChannel={handleLeaveChannel}
            currentChannel={currentChannel}
          />
          {currentChannel && (
            <>
              <DisplayMessages messages={messages} />
              <SendMessageForm user={user} currentChannel={currentChannel} />
              <SendQueueForm user={user} currentChannel={currentChannel} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
