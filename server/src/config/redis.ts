import { Redis } from "ioredis";

//Have to do for TypeScript
const redisPort: number = process.env.REDIS_ENDPOINT_PORT
  ? parseInt(process.env.REDIS_ENDPOINT_PORT)
  : 6379;

export const sub = new Redis({
  host: process.env.REDIS_ENDPOINT_ADDRESS,
  port: redisPort,
})
  .on("ready", () => console.log("Subscriber Redis client is ready"))
  .on("error", (error) => {
    console.error("Subscriber Redis client error:", error);
  });

export const pub = new Redis({
  host: process.env.REDIS_ENDPOINT_ADDRESS,
  port: redisPort,
})
  .on("ready", () => console.log("Publisher client is ready"))
  .on("error", (error) => {
    console.error("Publisher Redis client error:", error);
  });
