import type { MessageContent } from "@langchain/core/messages";

export type Messages = {
  role: "human" | "ai";
  content: MessageContent;
};