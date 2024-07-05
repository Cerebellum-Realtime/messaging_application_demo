import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
const port = process.env.PORT || 5001;
dotenv.config();
import { Socket } from "socket.io";
import { registerSubscriptionHandlers } from "./handlers/subscriptionHandler";
import { registerMessageHandlers } from "./handlers/messageHandler";
import { pub, sub } from "./config/redis";
import { createAdapter } from "@socket.io/redis-adapter";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.adapter(createAdapter(pub, sub));

const onConnection = (socket: Socket) => {
  registerSubscriptionHandlers(io, socket);
  registerMessageHandlers(io, socket);
};

io.on("connection", onConnection);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
