import { io } from "socket.io-client";

const URL = "http://localhost:8000";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY2hhdEFwcCIsImlhdCI6MTcyMDgxNjU0OH0.MkRD4Ml9Z-zkfuPwRX3EZxLrx8etG15ZDBjlnEGtXTc"; // main api key;
// this needs to be a signed jwt token..get this from the apiKey generator file

// axios post to '/auth' returns a token

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  // retries: 3,
  auth: {}, // insert token here?
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
});
