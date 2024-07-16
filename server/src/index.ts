import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { registerSubscriptionHandlers } from "./handlers/subscriptionHandler";
import { registerMessageHandlers } from "./handlers/messageHandler";
import { registerQueueHandlers } from "./handlers/queueHandler";
import { registerDisconnection } from "./handlers/disconnection";
import { pub, sub } from "./config/redis";
import { createAdapter } from "@socket.io/redis-adapter";
import * as dynamoose from "dynamoose";
import { authenticate } from "./middleware/authenticate";

dotenv.config();

const port = process.env.PORT || 8000;
const server = http.createServer(app);

if (process.env.NODE_ENV === "development") {
  dynamoose.aws.ddb.local("http://localhost:8001");
} else {
  // Create new DynamoDB instance
  const ddb = new dynamoose.aws.ddb.DynamoDB();
  // Set DynamoDB instance to the Dynamoose DDB instance
  dynamoose.aws.ddb.set(ddb);
}

// If you are running Dynamoose in an environment that has an IAM role attached to it (ex. Lambda or EC2),
// you do not need to do any additional configuration so
// long as your IAM role has appropriate permissions to access DynamoDB.

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingInterval: 1000,
  pingTimeout: 1000,
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000, // 2mins

    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});

io.adapter(createAdapter(pub, sub));

const onConnection = (socket: Socket) => {
  registerSubscriptionHandlers(io, socket);
  registerMessageHandlers(io, socket);
  registerQueueHandlers(io, socket);
  registerDisconnection(socket);
};

io.use(authenticate);

io.on("connection", (socket: Socket) => {
  onConnection(socket);
  console.log("Connection made");
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
