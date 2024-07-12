import { useEffect, useState } from "react";
import { socket } from "../socket";

const usePresence = (channelName, initialUserInfo) => {
  const [userInfo] = useState(initialUserInfo);
  const [currentPresence] = useState(channelName);

  useEffect(() => {
    if (!currentPresence) {
      return;
    }

    socket.emit("presenceSet:enter", currentPresence, userInfo);

    return () => {
      socket.emit("presenceSet:leave", currentPresence);
      console.log("user has left presence set");
    };
  }, [currentPresence, userInfo]); // Add dependencies

  const updateUserInfo = async (updatedUserInfo) => {
    socket.emit("presence:update", currentPresence, updatedUserInfo);
  };

  return { updateUserInfo };
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
