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
      socket.on("recovery:enable", () => {
        console.log("recovery has been enabled");
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected: ${reason}`);
      });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
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

  const handleChangeUser = (newUserName) => {
    setUser(newUserName);
  };

  return (
    <>
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
                toggleChangeUser={handleChangeUser}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
