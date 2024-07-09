import express, { Express, Request, Response } from "express";
import cors from "cors";
import healthCheck from "./routes/healthCheck";

const app: Express = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use("/", healthCheck);

export default app;
