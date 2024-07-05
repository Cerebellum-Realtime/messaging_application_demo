import { Socket } from "socket.io";

export const registerDisconnection = (socket: Socket) => {
  const disconnect = () => {
    console.log(`Socket ${socket.id} disconnected`);
  };

  socket.on("disconnect", disconnect);
};
