import { io } from "socket.io-client";

// const URL = "https://ws.chat.averylittlemore.xyz/"; // subdomain CNAME that points to the ALB goes here
const URL =
  "http://websoc-albwe-wg4t7acilzaa-1776303649.us-east-1.elb.amazonaws.com"; // subdomain CNAME that points to the ALB goes here

export const socket = io(URL, {
  autoConnect: false, // required for connection state recovery
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
});
