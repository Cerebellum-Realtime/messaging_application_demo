import { Server, Socket } from "socket.io";
import { putItem } from "../utils/dynamodb";

export const registerMessageHandlers = (io: Server, socket: Socket) => {
  const sendMessage = async (channel: string, message: string) => {
    try {
      console.log(`Sending message to channel ${channel}:`, message);

      const modifiedMessage = `${message}`;
      await putItem(channel, modifiedMessage);
      io.to(channel).emit("message:receive", {
        channel,
        message: modifiedMessage,
      });
    } catch (error) {
      console.error(`Failed to send message to ${channel}:`, error);
    }
  };

  socket.on("message:send", sendMessage);
};
