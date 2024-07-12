import { Redis } from "ioredis";
import { redisClient } from "../config/redis";

interface UserInfo {
  [key: string]: string;
}

const createChannelKey = (channelName: string): string =>
  `channel:${channelName}`;
const createChannelUserKey = (channelName: string, socketId: string): string =>
  `user:${channelName}:${socketId}`;
const createUserChannelsKey = (socketId: string): string =>
  `user:${socketId}:channels`;

export class ChannelPresenceManager {
  private redis: Redis;

  constructor() {
    this.redis = redisClient;
  }

  async addUserToChannel(
    channelName: string,
    socketId: string,
    userInfo: UserInfo
  ): Promise<void> {
    const multi = this.redis.multi();
    const userInfoWithSocketId = { ...userInfo, socketId }; // Add socketId to userInfo

    const channelKey = createChannelKey(channelName);
    const userKey = createChannelUserKey(channelName, socketId);
    const userChannelsKey = createUserChannelsKey(socketId);

    multi.sadd(channelKey, socketId);
    multi.hmset(userKey, userInfoWithSocketId);
    multi.sadd(userChannelsKey, channelName);

    await multi.exec();
  }

  async removeUserFromChannel(
    channelName: string,
    socketId: string
  ): Promise<void> {
    const channelKey = createChannelKey(channelName);
    const userKey = createChannelUserKey(channelName, socketId);
    const userChannelsKey = createUserChannelsKey(socketId);
    const multi = this.redis.multi();

    multi.srem(channelKey, socketId);
    multi.del(userKey);
    multi.srem(userChannelsKey, channelName);
    await multi.exec();
  }

  async getAllUsersInChannel(channelName: string): Promise<UserInfo[]> {
    const channelKey = createChannelKey(channelName);

    const socketIds = await this.redis.smembers(channelKey);

    const multi = this.redis.multi();

    socketIds.forEach((socketId) => {
      const userKey = createChannelUserKey(channelName, socketId);
      multi.hgetall(userKey);
    });

    const result = await multi.exec();
    if (result === null) return [];

    const users = result.map(([err, userInfo]) => {
      if (err || !userInfo) return null;
      return userInfo as UserInfo;
    });

    return users.filter((user) => user !== null);
  }

  async getUserChannels(socketId: string): Promise<string[]> {
    const userChannelsKey = createUserChannelsKey(socketId);
    return await this.redis.smembers(userChannelsKey);
  }

  async removeUserFromAllChannels(socketId: string): Promise<void> {
    const channels = await this.getUserChannels(socketId);
    const multi = this.redis.multi();

    for (const channel of channels) {
      const channelKey = createChannelKey(channel);
      const userKey = createChannelUserKey(channel, socketId);
      multi.srem(channelKey, socketId);
      multi.del(userKey);
    }

    const userChannelsKey = createUserChannelsKey(socketId);
    multi.del(userChannelsKey);

    await multi.exec();
  }

  async updateUserInfo(
    socketId: string,
    channelName: string,
    updatedUserInfo: UserInfo
  ) {
    const userKey = createChannelUserKey(channelName, socketId);
    const userInfo = await this.redis.hgetall(userKey);
    const mergedUserInfo = { ...userInfo, ...updatedUserInfo };
    await this.redis.hmset(userKey, mergedUserInfo);

    return mergedUserInfo;
  }
}

/*
Redis Pipeline:

  Purpose: Primarily for performance optimization.
  Operation: Sends multiple commands to the server in a single batch, without waiting for individual responses.
  Execution: Commands are executed sequentially, but not atomically.
  Error handling: If one command fails, others will still be processed.
  Response: Returns an array of responses, one for each command.
  Use case: Best for sending a large number of independent commands where order matters, but atomicity is not required.

Redis Multi (Transaction):

  Purpose: Ensures atomicity of a group of commands.
  Operation: Groups commands to be executed as a single atomic operation.
  Execution: Commands are executed sequentially and atomically - either all or none.
  Error handling: If any command fails, the entire transaction is aborted.
  Response: Returns an array of responses if successful, or an error if the transaction failed.
  Use case: When you need to ensure that a group of commands is executed without interruption and as a single unit.

  
*/
