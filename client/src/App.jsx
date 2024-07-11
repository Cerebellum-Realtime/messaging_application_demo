import { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";
import Username from "./components/Username";
import Channel from "./components/Channel";
import MessageDisplay from "./components/MessageDisplay";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  useEffect(() => {
    if (user) {
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  const handleUsernameSubmit = (username) => {
    setUser(username);
  };

  const handleLeaveChannel = () => {
    if (currentChannel) {
      setCurrentChannel(null);
    }
  };

  const handleJoinChannel = (channelName) => {
    setCurrentChannel(channelName);
  };

  return (
    <div className="container">
      {!user ? (
        <Username toggleUsernameSubmit={handleUsernameSubmit} />
      ) : (
        <>
          <p className="welcome">Welcome, {user}!</p>
          {!currentChannel ? (
            <Channel
              toggleJoinChannel={handleJoinChannel}
              toggleLeaveChannel={handleLeaveChannel}
              currentChannel={currentChannel}
            />
          ) : (
            <MessageDisplay
              currentChannel={currentChannel}
              user={user}
              toggleLeaveChannel={handleLeaveChannel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
