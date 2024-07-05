import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../config/dynamo";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

export async function listTables() {
  try {
    const data = await ddbDocClient.send(new ListTablesCommand({}));
    console.log(data);
  } catch (err) {
    console.error("Error listing tables:", err);
  }
}

export async function putItem(channel: string, message: string) {
  const params = {
    TableName: "Messages",
    Item: {
      id: uuidv4(),
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

// Function to get an item from DynamoDB
export async function getItem(id: string) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log("Item retrieved:", data.Item);
  } catch (err) {
    console.error("Error retrieving item:", err);
  }
}

// Function to update an item in DynamoDB
// export async function updateItem(id: string, updatedMessage: string) {
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       id,
//     },
//     UpdateExpression: updatedMessage,
//     ExpressionAttributeValues: {
//       ":d": "Updated description",
//     },
//     ReturnValues: "UPDATED_NEW",
//   };

//   try {
//     const data = await ddbDocClient.send(new UpdateCommand(params));
//     console.log("Item updated:", data.Attributes);
//   } catch (err) {
//     console.error("Error updating item:", err);
//   }
// }

// Function to delete an item from DynamoDB
// export async function deleteItem() {
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       id: "12345",
//     },
//   };

//   try {
//     const data = await ddbDocClient.send(new DeleteCommand(params));
//     console.log("Item deleted:", data);
//   } catch (err) {
//     console.error("Error deleting item:", err);
//   }
// }
