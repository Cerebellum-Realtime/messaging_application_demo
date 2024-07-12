import { useEffect, useState } from "react";
import { socket } from "../socket";

const usePresenceListener = (channelName) => {
  const [currentPresence] = useState(channelName);
  const [presenceData, setPresenceData] = useState([]);

  useEffect(() => {
    if (!currentPresence) {
      return;
    }

    const handlePresenceLeave = (socketId) => {
      setPresenceData((prevData) => {
        console.log(socketId, prevData);
        return prevData.filter((data) => data.socketId !== socketId);
      });
    };

    const handlePresenceJoin = (response) => {
      setPresenceData((prevData) => prevData.concat(response));
    };

    const handlePresenceUpdate = (response) => {
      setPresenceData((prevData) =>
        prevData.map((data) =>
          data.socketId === response.socketId ? response : data
        )
      );
    };

    const handlePresenceSubscribe = (ack) => {
      if (ack.success === true) {
        setPresenceData(ack.users);
        socket.on(`presence:${currentPresence}:leave`, handlePresenceLeave);
        socket.on(`presence:${currentPresence}:join`, handlePresenceJoin);
        socket.on(`presence:${currentPresence}:update`, handlePresenceUpdate);
      }
    };

    socket.emit("presence:subscribe", currentPresence, handlePresenceSubscribe);

    return () => {
      socket.emit(`presence:unsubscribe`);
      socket.off(`presence:${currentPresence}:leave`, handlePresenceLeave);
      socket.off(`presence:${currentPresence}:join`, handlePresenceJoin);
      socket.off(`presence:${currentPresence}:update`, handlePresenceUpdate);
    };
  }, [currentPresence]);

  useEffect(() => {
    console.log("Presence Data Updated:", presenceData);
  }, [presenceData]);

  return { presenceData };
};

export default usePresenceListener;
