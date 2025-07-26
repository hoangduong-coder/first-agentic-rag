import { ContextRetriever } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { workflow } from "./workflow";
import { MemorySaver } from "@langchain/langgraph";
import {
  AIMessage,
  HumanMessage,
  MessageContent,
} from "@langchain/core/messages";
import { NextFunction, Request, Response } from "express";

// Model
interface Messages {
  role: "human" | "ai";
  content: MessageContent;
}

const chatSession: Array<Messages> = [];

// Controller
export const healthCheck = (_req: Request, res: Response) => {
  res.status(200).json("Health check done! Welcome to Agent API");
};

export const getChatSession = (_req: Request, res: Response) => {
  res.json(chatSession);
};

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tsContextRetriever = new ContextRetriever("https://www.typescriptlang.org/docs/handbook/");
    const nodeContextRetriever = new ContextRetriever("https://blog.logrocket.com/express-typescript-node/");
    
    const tools = [tsContextRetriever, nodeContextRetriever];
    const toolNode = new ToolNode(tools);

    const newWorkflow = workflow(tools, toolNode);
    const checkPointer = new MemorySaver();

    const app = newWorkflow.compile({ checkpointer: checkPointer });

    const agentMessages = chatSession.map((message) =>
      message.role === "human"
        ? new HumanMessage({ content: message.content })
        : new AIMessage({ content: message.content })
    );
    
    const { query } = req.body;

    chatSession.push({ role: "human", content: query });
    agentMessages.push(new HumanMessage(`
      Please provide a helpful message for this query: ${query}
      If you're unsure, just achknowledge the question and ask for verification question if it's helpful. 
      If you don't know the answer, say you don't know. Don't try to make up an answer.
    `))

    const finalMessages = await app.invoke(
      {
        messages: agentMessages,
      },
      {
        configurable: { thread_id: 42 },
      }
    );

    const aiContent =
      finalMessages.messages[finalMessages.messages.length - 1]["content"];

    chatSession.push({ role: "ai", content: aiContent });

    res.status(201).json({ query: query, answer: aiContent });
  } catch (error) {
    next(error);
  }
};
