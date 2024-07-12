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

    socket.on("connect", () => {
      console.log("recovered?", socket.id, socket.recovered);

      // closes the low-level connection and trigger a reconnection
      // To use in test suite for testing purposes
      // setTimeout(() => {
      //   socket.io.engine.close();
      // }, Math.random() * 5000 + Math.random() * 5000);
    });

    socket.on("recovery:enable", () => {
      console.log("recovery has been enabled");
    });

    socket.on("message:receive", handleMessage);

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    return () => {
      socket.off("connect");
      socket.off("message:receive", handleMessage);
      socket.off("disconnect");
    };
  }, []);

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
