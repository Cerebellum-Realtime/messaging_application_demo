const { handleConnection } = require("../controllers/socketController");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const { createAdapter } = require("@socket.io/redis-adapter");

const createSocketServer = () => {
  const httpServer = createServer();

  const ioServer = new Server(httpServer, {
    transports: ["websocket", "polling"],
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // ioServer.adapter(createAdapter(pubClient, subClient));

  ioServer.on("connection", (socket) => {
    handleConnection(socket, ioServer);
    console.log("connected");
  });

  return ioServer;
};

module.exports = { createSocketServer };
