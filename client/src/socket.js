import { io } from "socket.io-client";

const URL = "Austin-ALBWe-w0BO7CGZgfBw-1261594466.us-east-1.elb.amazonaws.com";
// const URL = "localhost:8000";

export const socket = io(URL, {
  autoConnect: true, // required for connection state recovery
  transports: ["websocket"], // Include both websocket and polling as fallback
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnections
  reconnectionDelayMax: 5000, // Maximum delay between reconnections
  timeout: 20000, // Before a connection attempt is considered failed
});
