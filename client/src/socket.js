import { io } from "socket.io-client";

// const URL = "http://localhost:8000";
const URL = "WebSoc-ALBWe-hirjoGMoWK9V-571566059.us-east-1.elb.amazonaws.com";

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  retries: 3,
  auth: {}, // Token gets added in Username component
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
});
