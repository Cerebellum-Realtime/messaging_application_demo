import { io } from "socket.io-client";

const URL = "WebSoc-ALBWe-gcuqc2XgyiXp-126517574.us-east-2.elb.amazonaws.com";

export const socket = io(URL, {
  autoConnect: false, // required for connection state recovery
  transports: ["websocket"], // Include both websocket and polling as fallback
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
