import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

interface messageBodyType {
  event: string;
  userId: string;
  timestamp: number;
}

// AWS.config.update({ region: "us-east-1" });
// Create an SQS client
const sqs = new SQSClient({});

// Function to send a message to the SQS queue
export const sendMessageToQueue = async (
  messageBody: messageBodyType
): Promise<void> => {
  // Use the queue URL from an environment variable or configuration
  const queueUrl =
    "https://sqs.us-east-2.amazonaws.com/654654177904/WebSocketServerStack-ALBEventQueueQueueB68FE5CF-jkoFbrK83iSU";

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };

  try {
    // const response = await sqs.send(command);

    const result = await sqs.send(new SendMessageCommand(params));
    console.log("Message sent:", result.MessageId);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Example usage
const messageBody: messageBodyType = {
  event: "user_signup",
  userId: "12345",
  timestamp: Date.now(),
};

sendMessageToQueue(messageBody);
