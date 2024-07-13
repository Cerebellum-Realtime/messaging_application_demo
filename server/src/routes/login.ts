import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Cerebellum } from "../utils/token";
import dotenv from "dotenv";
dotenv.config();
const API_Key = process.env.API_KEY || "sample key";
const login = express.Router();
const cerebellum = new Cerebellum(API_Key);

login.post("/", (req: Request, res: Response) => {
  const { username } = req.body;

  const token = cerebellum.createTokenRequest({ username });

  return res.status(200).send(token);
});

export default login;
