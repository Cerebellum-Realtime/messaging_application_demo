import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket";

const useChannel = (channelName, setPreviousMessages, callback) => {
  const callbackRef = useRef(callback);
  const [currentChannel, setCurrentChannel] = useState(channelName);
  const [channelId, setChannelId] = useState(null);
  const memoizedSetPreviousMessages = useCallback(setPreviousMessages, [
    setPreviousMessages,
  ]);

  useEffect(() => {
    //If currentChannel is null, we don't subscribe to a new channel
    if (!currentChannel) {
      return;
    }

    socket.emit("channel:subscribe", currentChannel, (ack) => {
      if (ack.success) {
        setChannelId(ack.channelId);
        if (ack.pastMessages) {
          memoizedSetPreviousMessages(ack.pastMessages);
        }
      } else {
        console.error(`Failed to subscribe to channel ${currentChannel}`);
      }
    });

    const handleMessageReceive = (message) => {
      callbackRef.current(message);
    };

    socket.on(`message:receive:${currentChannel}`, handleMessageReceive);

    // Cleanup on unmount
    return () => {
      socket.emit(`channel:unsubscribe`, currentChannel, (ack) => {
        if (ack.success) {
          console.log(`Unsubscribed from channel ${currentChannel}`);
        } else {
          console.error(`Failed to unsubscribe from channel ${currentChannel}`);
        }
      });
      socket.off(`message:receive:${currentChannel}`, handleMessageReceive);
    };
  }, [memoizedSetPreviousMessages, currentChannel]);

  const publish = (messageData) => {
    console.log(channelId);
    socket.emit("message:send", channelId, currentChannel, messageData);
  };

  const queue = (messageData) => {
    socket.emit("message:queue", channelId, currentChannel, messageData);
  };

  const subscribe = (newChannel) => {
    setCurrentChannel(newChannel);
  };

  const unsubscribe = () => {
    setCurrentChannel(null);
  };

  return { publish, queue, subscribe, unsubscribe };
};

export default useChannel;
