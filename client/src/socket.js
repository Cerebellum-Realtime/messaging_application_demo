import { io } from "socket.io-client";

const URL = "ALB-ws-1063097076.us-east-1.elb.amazonaws.com";

export const socket = io(URL, {
  path: "/socket.io",
  transports: ["websocket"], // Include both websocket and polling as fallback
});
