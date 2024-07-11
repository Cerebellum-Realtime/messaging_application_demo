import { Redis } from "ioredis";
import { redisClient } from "../config/redis";
import { userInfo } from "os";

interface UserInfo {
  additionalInfo: { [key: string]: string | number };
}

// keyUtils.ts

const createChannelKey = (channelId: string): string => `channel:${channelId}`;
const createChannelUserKey = (channelId: string, socketId: string): string =>
  `user:${channelId}:${socketId}`;

class ChannelPresenceManager {
  private redis: Redis;

  constructor() {
    this.redis = redisClient;
  }
  async addUserToChannel(
    channelId: string,
    socketId: string,
    userInfo: UserInfo
  ): Promise<void> {
    const multi = this.redis.multi();
    const userInfoWithSocketId = { ...userInfo, socketId }; // Add socketId to userInfo
    const userJson = JSON.stringify(userInfoWithSocketId);

    const channelKey = createChannelKey(channelId);
    const userKey = createChannelUserKey(channelId, socketId);

    multi.sadd(channelKey, socketId);
    multi.hset(userKey, userJson);
    await multi.exec();
  }

  async removeUserFromChannel(
    channelId: string,
    socketId: string
  ): Promise<void> {
    const channelKey = createChannelKey(channelId);
    const userKey = createChannelUserKey(channelId, socketId);
    const multi = this.redis.multi();

    multi.srem(channelKey, socketId);
    multi.del(userKey);
    await multi.exec();
  }

  async getAllUsersInChannel(channelId: string) {
    const channelKey = createChannelKey(channelId);

    const socketIds = await this.redis.smembers(channelKey);

    const pipeline = this.redis.pipeline();

    socketIds.forEach((socketId) => {
      const userKey = createChannelUserKey(channelId, socketId);
      pipeline.get(userKey);
    });

    const result = await pipeline.exec();
    if (result === null) return [];

    const users = result.map(([err, userJson]) => {
      if (err || !userJson) return null;

      if (typeof userJson === "string") {
        return JSON.parse(userJson);
      } else {
        return null;
      }
    });

    return users.filter((user) => user !== null);
  }
}

/*
  Pipeline is redis specific. It allows up to send all the requests in a round trip
  It will reduce the total number of requests that a redis serve r will recieve
  We can build up all the commands at one time, and send them to redis to be executed
*/
