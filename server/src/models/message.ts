import * as dynamoose from "dynamoose";

const messageSchema = new dynamoose.Schema({
  channelId: {
    type: String,
    hashKey: true,
  },
  messageId: {
    type: String,
    rangeKey: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const Message = dynamoose.model("messages", messageSchema);
