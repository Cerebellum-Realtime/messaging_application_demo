import { io } from "socket.io-client";

const URL = "WebSoc-ALBWe-dz0czfsaC6hq-971131539.us-east-2.elb.amazonaws.com";

export const socket = io(URL, {
  transports: ["websocket"], // Include both websocket and polling as fallback
});
