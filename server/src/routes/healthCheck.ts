import express, { Request, Response } from "express";

const healthCheck = express.Router();

// Define a GET route on the root path ('/') that responds with a simple message.

healthCheck.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is healthy");
});

export default healthCheck;
