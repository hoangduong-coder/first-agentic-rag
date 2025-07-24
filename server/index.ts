import express from "express";
import { createChat } from "./service";
import { errorHandler } from "./errorHandler";
import config from "./config";

const app = express();

app.use(express.json());

app.post("/api/chat", createChat);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
