import { v4 as uuidv4 } from "uuid";
import { Channel } from "../models/channel";

export class DB {
  async addChannel(channelName: string) {
    try {
      const existingChannel = await this.getChannel(channelName);

      if (existingChannel) {
        return existingChannel;
      } else {
        const newChannel = new Channel({
          channelId: uuidv4(),
          channelName: channelName,
        });

        await newChannel.save();
        return newChannel.channelId;
      }
    } catch (error) {
      console.error("Error adding channel:", error);
      throw error;
    }
  }

  async getChannel(channelName: string) {
    try {
      const channel = await Channel.query("channelName").eq(channelName).exec();
      return channel[0];
    } catch (error) {
      console.error("Error fetching channel:", error);
    }
  }

  async scanTable(tableName: string) {
    try {
      const items = await Channel.scan().exec();

      const result = await items.populate();
      console.log("Scanned Items:", result);
      return items;
    } catch (error) {
      console.error("An error occurred scanning the table:", error);
      throw error;
    }
  }
}
