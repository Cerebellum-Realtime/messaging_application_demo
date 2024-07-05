import { Schema, model } from "dynamoose";

export const channelSchema = new Schema({
  channelId: {
    type: String,
    hashKey: true,
  },
  channelName: {
    type: String,
    index: true
  },
});

export const Channel = model("Channel", channelSchema);
