import {
  CreateTableCommand,
  CreateTableCommandInput,
  QueryCommand,
  ScalarAttributeType,
  ScanCommand,
  DeleteTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../src/config/dynamo";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { timeStamp } from "console";

// export async function createTable() {
//   const params: CreateTableCommandInput = {
//     TableName: "Message",
//     KeySchema: [
//       { AttributeName: "id", KeyType: "HASH" },
//       { AttributeName: "channel", KeyType: "RANGE" },
//     ],
//     AttributeDefinitions: [
//       { AttributeName: "id", AttributeType: "S" as ScalarAttributeType },
//       { AttributeName: "channel", AttributeType: "S" as ScalarAttributeType },
//     ],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 5,
//       WriteCapacityUnits: 5,
//     },
//   };

//   try {
//     const data = await ddbDocClient.send(new CreateTableCommand(params));
//     console.log("Table created:", data);
//   } catch (err) {
//     console.error("Error creating table:", err);
//   }
// }

export async function createChannelTable() {
  const params: CreateTableCommandInput = {
    TableName: "Message",
    KeySchema: [
      { AttributeName: "channel", KeyType: "HASH" },
      { AttributeName: "id", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "channel", AttributeType: "S" as ScalarAttributeType },
      { AttributeName: "id", AttributeType: "N" as ScalarAttributeType },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const data = await ddbDocClient.send(new CreateTableCommand(params));
    console.log("Table created:", data);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// export async function putItem(channel: string, message: string) {
//   const params = {
//     TableName: "Message",
//     Item: {
//       id: uuidv4(),
//       channel,
//       message,
//     },
//   };

//   try {
//     const data = await ddbDocClient.send(new PutCommand(params));
//     console.log("Item inserted:", data);
//   } catch (err) {
//     console.error("Error inserting item:", err);
//   }
// }

// export async function putItem(channel: string, message: string) {
//   const params = {
//     TableName: "Message",
//     Item: {
//       channel,
//       timestamp: Date.now(),
//       message,
//     },
//   };

//   try {
//     const data = await ddbDocClient.send(new PutCommand(params));
//     console.log("Item inserted:", data);
//   } catch (error) {
//     console.error("Error inserting item:", error);
//   }
// }

// export async function scanTable() {
//   const params = {
//     TableName: "Message",
//   };

//   try {
//     const data = await ddbDocClient.send(new ScanCommand(params));
//     console.log(data.Items);
//   } catch (error) {
//     console.error("An error occurred scanning the table:", error);
//   }
// }

// export async function queryMessageByChannel(channel: string) {
//   const params = {
//     TableName: "Message",
//     KeyConditionExpression: "channel = :channel",
//     ExpressionAttributeValues: {
//       ":channel": { S: channel },
//     },
//     scanIndexForward: true,
//   };

//   try {
//     const data = await ddbDocClient.send(new QueryCommand(params));
//     const response = data.Items?.map((item) => item.message.S);

//     console.log(response);
//   } catch (error) {
//     console.error("An error occurred with making a query:", error);
//   }
// }

export async function deleteTable() {
  const params = new DeleteTableCommand({
    TableName: "Message",
  });

  try {
    const response = await ddbDocClient.send(params);
    console.log(response);
    return response;
  } catch (error) {
    console.error("An error occurred deleting the table:", error);
  }
}

// // createTable();
// putItem("team_2", "This is a message!");

// queryMessageByChannel("team_2");
// // CreationDateTime: 2024-07-05T21:05:49.911Z,
