import { Server, Socket } from "socket.io";
import { ChannelPresenceManager } from "../utils/presence";

const presenceManager = new ChannelPresenceManager();

interface UserInfo {
  [key: string]: string;
}

interface PresenceCallback {
  (response: { success: boolean; users?: UserInfo[]; error?: Error }): void;
}

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
  const enterPresenceSet = async (channelName: string, userInfo: UserInfo) => {
    try {
      await presenceManager.addUserToChannel(channelName, socket.id, userInfo);
      const userIncSocketId = { ...userInfo, socketId: socket.id };
      io.to(`presence:${channelName}`).emit(
        `presence:${channelName}:join`,
        userIncSocketId
      );
    } catch (error) {
      console.error("Error entering presence set:", error);
    }
  };

  const leavePresenceSet = async (channelName: string) => {
    try {
      await presenceManager.removeUserFromChannel(channelName, socket.id);
      io.to(`presence:${channelName}`).emit(
        `presence:${channelName}:leave`,
        socket.id
      );
    } catch (error) {
      console.error("Error leaving presence set:", error);
    }
  };

  const subscribePresenceSet = async (
    channelName: string,
    callback: PresenceCallback
  ) => {
    try {
      await socket.join(`presence:${channelName}`);
      const users = await presenceManager.getAllUsersInChannel(channelName);
      callback({ success: true, users });
    } catch (error) {
      console.error("Error subscribing to presence set:", error);
      if (error instanceof Error) {
        callback({ success: false, error });
      } else {
        callback({ success: false });
      }
    }
  };

  const unSubscribePresenceSet = async (channelName: string) => {
    try {
      await socket.leave(`presence:${channelName}`);
    } catch (error) {
      console.error("Error unsubscribing from presence set:", error);
    }
  };
    
  const handlePresenceDisconnection = async () => {
    try {
      const channels = await presenceManager.getUserChannels(socket.id);
      await presenceManager.removeUserFromAllChannels(socket.id);
      for (const channelName of channels) {
        io.to(`presence:${channelName}`).emit(
          `presence:${channelName}:leave`,
          socket.id
        );
      }
    } catch (error) {
      console.error("Error handling presence disconnection:", error);
    }
  };

  const updateUserInfo = async (
    channelName: string,
    updatedUserInfo: UserInfo
  ) => {
    try {
      const result = await presenceManager.updateUserInfo(
        socket.id,
        channelName,
        updatedUserInfo
      );
      io.to(`presence:${channelName}`).emit(
        `presence:${channelName}:update`,
        result
      );
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  socket.on("presenceSet:enter", enterPresenceSet);
  socket.on("presenceSet:leave", leavePresenceSet);
  socket.on("presence:subscribe", subscribePresenceSet);
  socket.on("presence:unsubscribe", unSubscribePresenceSet);
  socket.on("presence:update", updateUserInfo);
  socket.on("disconnect", handlePresenceDisconnection);
};
