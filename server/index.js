const { createSocketServer } = require("./config/socketServer");
const redis = require("redis");

const main = async () => {
  // const redisClient = redis.createClient();
  // const pubClient = redisClient.duplicate();
  // const subClient = redisClient.duplicate();

  // await Promise.all([
  //   redisClient.connect(),
  //   pubClient.connect(),
  //   subClient.connect(),
  // ]);

  const ioServer = await createSocketServer();

  ioServer.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};

main();