import { ContextRetriever } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { Workflow } from "./workflow";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

const contextRetriever = new ContextRetriever(
  "https://www.typescriptlang.org/docs/handbook/"
);
const tools = [contextRetriever];
const toolNode = new ToolNode(tools);

const newWorkflow = Workflow(tools, toolNode);
const checkPointer = new MemorySaver();

const app = newWorkflow.compile({ checkpointer: checkPointer });

const finalMessages = app.invoke(
  {
    messages: [
      new HumanMessage({ content: "What are TypeScript primitive types" }),
    ],
  },
  {
    configurable: { thread_id: 42 },
  }
);

console.log(finalMessages["messages"]);
