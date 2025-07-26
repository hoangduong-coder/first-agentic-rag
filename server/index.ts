import express from "express";
import { createChat, getChatSession, healthCheck } from "./service";
import { errorHandler } from "./errorHandler";
import config from "./config";

const app = express();

app.use(express.json());

app.get("/api", healthCheck);

app.get("/api/get-chat", getChatSession)

app.post("/api/chat", createChat);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
