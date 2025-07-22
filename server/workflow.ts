import 'dotenv/config';
import {
  END,
  START,
  StateGraph,
  MessagesAnnotation,
  Annotation,
} from "@langchain/langgraph";
import { ContextRetriever } from "./tools";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const apiKey: string = process.env.OPENAI_API_KEY || "";

export const Workflow = (
  tools: ContextRetriever[],
  toolNode: ToolNode<any>
) => {
  const shouldContinueWorkflow = (state: typeof MessagesAnnotation.State) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && "toolCalls" in lastMessage) return "tools";
    return END;
  };

  const model = new ChatOpenAI({
    model: "gpt-4.1-nano",
    temperature: 0,
    apiKey: apiKey,
  }).bindTools(tools);

  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const messages = state.messages;
    const response = await model.invoke(messages);
    return { messages: [response] };
  };

  const GraphAnnotation = Annotation.Root({
    language: Annotation<string>(),
    ...MessagesAnnotation.spec,
  });

  const workflow = new StateGraph(GraphAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinueWorkflow)
    .addEdge("tools", "agent");

  return workflow;
};
