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

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

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
