import { Schema, model } from "dynamoose";

export const channelSchema = new Schema({
  channelName: {
    type: String,
    hashKey: true,
  },
  channelId: {
    type: String,
  },
});

export const Channel = model("channels", channelSchema);
