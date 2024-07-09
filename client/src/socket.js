import { io } from "socket.io-client";

const URL = "WebSoc-ALBWe-xZnY5RFZxkZH-132878851.us-east-1.elb.amazonaws.com";

export const socket = io(URL, {
  transports: ["websocket"], // Include both websocket and polling as fallback
});
