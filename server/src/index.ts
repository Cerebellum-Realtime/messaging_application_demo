import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { registerSubscriptionHandlers } from "./handlers/subscriptionHandler";
import { registerMessageHandlers } from "./handlers/messageHandler";
import { registerDisconnection } from "./handlers/disconnection";
import { pub, sub } from "./config/redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { listTables } from "./utils/dynamodb";
import * as dynamoose from "dynamoose";
dotenv.config();

const port = process.env.PORT || 8000;
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
  registerDisconnection(socket);
};

io.on("connection", onConnection);

dynamoose.aws.ddb.local("http://localhost:8001");

const schema = new dynamoose.Schema(
  {
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updateDate",
    },
  }
);

const Channel = dynamoose.model("channels", schema);

listTables();

console.log(Channel.name);

const newChannel = new Channel({
  channelId: "1234",
  channelName: "team_2",
});

const test = async () => {
  await newChannel.save();
};

test();
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
