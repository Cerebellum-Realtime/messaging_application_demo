import { Server, Socket } from "socket.io";

export const registerMessageHandlers = (io: Server, socket: Socket) => {
  const sendMessage = (channel: string, message: string) => {
    try {
      console.log(`Sending message to channel ${channel}:`, message);

      const modifiedMessage = `${message} - processed by server`;

      io.to(channel).emit("new message", { channel, message: modifiedMessage });
    } catch (error) {
      console.error(`Failed to send message to ${channel}:`, error);
    }
  };

  socket.on("new message", sendMessage);
};
