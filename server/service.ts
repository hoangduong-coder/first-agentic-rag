import { ContextRetriever } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { workflow } from "./workflow";
import { MemorySaver } from "@langchain/langgraph";
import {
  AIMessage,
  HumanMessage,
  MessageContent,
  SystemMessage,
} from "@langchain/core/messages";
import { NextFunction, Request, Response } from "express";
import { systemPrompt } from "./prompt";

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
    const reactContextRetriever = new ContextRetriever("https://www.typescriptlang.org/docs/handbook/react.html");
    const fullstackContextRetriever = new ContextRetriever("https://fullstackopen.com/en/");
    
    const tools = [tsContextRetriever, nodeContextRetriever, reactContextRetriever, fullstackContextRetriever];
    const toolNode = new ToolNode(tools);

    const newWorkflow = workflow(tools, toolNode);
    const checkPointer = new MemorySaver();

    const app = newWorkflow.compile({ checkpointer: checkPointer });

    const agentMessages: Array<HumanMessage | AIMessage | SystemMessage> = [];

    agentMessages.push(
      new SystemMessage(systemPrompt)
    );

    if (chatSession.length !== 0) {
      for (const message of chatSession) {
        if (message.role === "human") {
          agentMessages.push(new HumanMessage({ content: message.content }));
        } else {
          agentMessages.push(new AIMessage({ content: message.content }));
        }
      }
    }
    
    const { query } = req.body;

    chatSession.push({ role: "human", content: query });
    agentMessages.push(new HumanMessage(query))

    const finalMessages = await app.invoke(
      {
        messages: agentMessages,
      },
      {
        configurable: { thread_id: 42 },
      }
    );

    const aiContent = finalMessages.messages[finalMessages.messages.length - 1]["content"];

    chatSession.push({ role: "ai", content: aiContent });

    res.status(201).json({ query: query, answer: aiContent });
  } catch (error) {
    next(error);
  }
};
