import { useEffect, useState } from "react";
import { socket } from "../socket";

const usePresence = (channelName, initialUserInfo) => {
  const [currentPresence] = useState(channelName);
  const [presenceData, setPresenceData] = useState([]);
  const [userInfo] = useState(initialUserInfo);

  useEffect(() => {
    if (!currentPresence) {
      return;
    }

    const handlePresenceLeave = (socketId) => {
      setPresenceData((prevData) =>
        prevData.filter((data) => data.socketId !== socketId)
      );
    };

    const handlePresenceJoin = (response) => {
      setPresenceData((prevData) => [...prevData, response]);
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
        socket.off(`presence:${currentPresence}:leave`, handlePresenceLeave);
        socket.off(`presence:${currentPresence}:join`, handlePresenceJoin);
        socket.off(`presence:${currentPresence}:update`, handlePresenceUpdate);

        socket.on(`presence:${currentPresence}:leave`, handlePresenceLeave);
        socket.on(`presence:${currentPresence}:join`, handlePresenceJoin);
        socket.on(`presence:${currentPresence}:update`, handlePresenceUpdate);

        // Enter user into presence set
        socket.emit("presenceSet:enter", currentPresence, userInfo);
      }
    };

    const handleSocketConnect = () => {
      // Re-subscribe on socket reconnect
      console.log(currentPresence, "current presence");
      socket.emit(
        "presence:subscribe",
        currentPresence,
        handlePresenceSubscribe
      );
    };

    socket.emit("presence:subscribe", currentPresence, handlePresenceSubscribe);
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.emit("presenceSet:leave", currentPresence);
      socket.emit(`presence:unsubscribe`);
      socket.off("connect", handleSocketConnect);

      socket.off(`presence:${currentPresence}:leave`, handlePresenceLeave);
      socket.off(`presence:${currentPresence}:join`, handlePresenceJoin);
      socket.off(`presence:${currentPresence}:update`, handlePresenceUpdate);
    };
  }, [currentPresence, userInfo]);

  useEffect(() => {
    console.log("Presence Data Updated:", presenceData);
  }, [presenceData]);

  const updateUserInfo = async (updatedUserInfo) => {
    socket.emit("presence:update", currentPresence, updatedUserInfo);
  };

  return { presenceData, updateUserInfo };
};

export default usePresence;

/*
  We need the listeners like the following
    - usePresence
      - enters the user into the PresenceSet
      - can pass in initial data
      - return updateStatus
        - this allows you to update the userPresence
      - when the component unmounts, we need to remove them from presence set
      - subscribe(subscribe to a new presence set)
      - unsubscribe(unsubscribe from the presence set)
      - updateStatus(updates the userInfo)

      
    - usePresenceListener(channelName)
      - this subscribes you presence data
      - returns an an array that will dynamically update based on if users enter and leave a set
*/
