import { Server, Socket } from "socket.io";
import { DB } from "../utils/db";

const db = new DB();
export const registerSubscriptionHandlers = (io: Server, socket: Socket) => {
  const subscribe = async (channel: string, callback: Function) => {
    try {
      const result = await Promise.all([
        socket.join(channel),
        db.addChannel(channel),
      ]);
      const channelInfo = {
        channelName: channel,
        channelId: result[1],
      };

      const pastMessages = await db.getAllMessagesForChannel(
        channelInfo.channelId
      );

      if (typeof callback === "function") {
        callback({
          success: true,
          message: `Successfully subscribed to ${channel}`,
          channelInfo,
          pastMessages,
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
