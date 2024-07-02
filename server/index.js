const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { handleConnection } = require("./controllers/socketController");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);
const io = socketIo(server, {
  transports: ["websocket", "polling"],
  methods: ["GET", "POST"],
  cors: {
    origin: "*",
  },
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Server is healthy");
});

// Socket.IO connection handler
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
