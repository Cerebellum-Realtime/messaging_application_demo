import { Server, Socket } from "socket.io";

export const registerSubscriptionHandlers = (io: Server, socket: Socket) => {
  const subscribe = async (channel: string, callback: Function) => {
    try {
      await socket.join(channel);

      if (typeof callback === "function") {
        callback({
          success: true,
          message: `Successfully subscribed to ${channel}`,
        });
      }
    } catch (error) {
      console.error(`Failed to subscribe to ${channel}:`, error);
      if (typeof callback === "function") {
        callback({
          success: false,
          message: `Failed to subscribe to ${channel}`,
        });
      }
    }
  };

  const unsubscribe = async (channel: string, callback: Function) => {
    try {
      await socket.leave(channel);
      if (typeof callback === "function") {
        callback({
          success: true,
          message: "You have left the channel",
        });
      }
    } catch (error) {
      console.error(`Failed to unsubscribe from ${channel}:`, error);
    }
  };

  socket.on("channel:subscribe", subscribe);
  socket.on("channel:unsubscribe", unsubscribe);
};
