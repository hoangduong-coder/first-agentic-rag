import { ContextRetriever } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { workflow } from "./workflow";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, MessageContent } from "@langchain/core/messages";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Model
interface ChatMessage {
  id: string;
  humanMessage: string;
  aiMessage: MessageContent;
}

// Controller
export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contextRetriever = new ContextRetriever(
      "https://www.typescriptlang.org/docs/handbook/"
    );
    const tools = [contextRetriever];
    const toolNode = new ToolNode(tools);

    const newWorkflow = workflow(tools, toolNode);
    const checkPointer = new MemorySaver();

    const app = newWorkflow.compile({ checkpointer: checkPointer });

    const { humanMessage }: { humanMessage: string } = req.body;

    const finalMessages = await app.invoke(
      {
        messages: [new HumanMessage({ content: humanMessage })],
      },
      {
        configurable: { thread_id: 42 },
      }
    );

    const chatMessage: ChatMessage = {
      id: uuidv4(),
      humanMessage: humanMessage,
      aiMessage:
        finalMessages.messages[finalMessages.messages.length - 1]["content"],
    };

    res.status(201).json(chatMessage);
  } catch (error) {
    next(error);
  }
};
