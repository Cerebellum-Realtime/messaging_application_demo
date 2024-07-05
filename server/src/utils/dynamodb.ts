import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../config/dynamo";
import {
  ListTablesCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

export async function listTables() {
  try {
    const data = await ddbDocClient.send(new ListTablesCommand({}));
    console.log("Current Tables: ", data.TableNames);
  } catch (err) {
    console.error("Error listing tables:", err);
  }
}

export async function addChannel(channel: string, message: string) {
  const params = {
    TableName: "Message",
    Item: {
      channel,
      message,
    },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Item inserted:", data);
  } catch (err) {
    console.error("Error inserting item:", err);
  }
}

// export async function scanTable() {
//   const params = {
//     TableName: "channels",
//   };

//   try {
//     const data = await ddbDocClient.send(new ScanCommand(params));
//     console.log(data.Items);
//   } catch (error) {
//     console.error("An error occurred scanning the table:", error);
//   }
// }

export async function queryMessageByChannel(channel: string) {
  const params = {
    TableName: "Message",
    KeyConditionExpression: "channel = :channel",
    ExpressionAttributeValues: {
      ":channel": { S: channel },
    },
    scanIndexForward: true,
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    const response = data.Items?.map((item) => item.message.S);

    console.log(response);
  } catch (error) {
    console.error("An error occurred with making a query:", error);
  }
}

// export async function deleteTable() {
//   const params = new DeleteTableCommand({
//     TableName: "Message",
//   });

//   try {
//     const response = await ddbDocClient.send(params);
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.error("An error occurred deleting the table:", error);
//   }
// }
