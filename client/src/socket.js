import { io } from "socket.io-client";

const URL = "localhost:8000";

export const socket = io(URL, {
  transports: ["websocket"], // Include both websocket and polling as fallback
  autoConnect: false,
});
