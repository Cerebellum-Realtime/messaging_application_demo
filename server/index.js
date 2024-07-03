const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { handleConnection } = require("./controllers/socketController");
const app = express();
const redis = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const { socket } = require("../client/src/socket");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_ENDPOINT_ADDRESS,
    port: process.env.REDIS_ENDPOINT_PORT,
  },
});

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

const makeConnections = async () => {
  await Promise.all([
    redisClient.connect(),
    pubClient.connect(),
    subClient.connect(),
  ]);
};

makeConnections();

const io = new Server(server, {
  methods: ["GET", "POST"],
  cors: {
    origin: "*",
  },
});

io.adapter(createAdapter(pubClient, subClient));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Server is healthy");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  handleConnection(socket, io);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Add other event handlers as needed
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
