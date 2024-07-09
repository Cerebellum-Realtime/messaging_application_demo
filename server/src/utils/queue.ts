import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const queueUrl: string = process.env.QUEUE_URL || "";
// Create an SQS client
const sqs = new SQSClient({ endpoint: queueUrl });

// Function to send a message to the SQS queue
export const sendMessageToQueue = async (
  channelId: string,
  message: string,
  sendDescription: string
): Promise<void> => {
  // Use the queue URL from an environment variable or configuration

  // we create messageId and createdAt time
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      channelId,
      createdAt_messageId: `${Date.now()
        .toString()
        .padStart(20, "0")}_${uuidv4()}`,
      content: `${channelId}: ${message} => ${sendDescription}`,
    }),
  };

  try {
    const result = await sqs.send(new SendMessageCommand(params));
    console.log("Message sent:", result.MessageId);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
