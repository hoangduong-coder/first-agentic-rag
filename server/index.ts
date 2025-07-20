import { ContextRetriever } from "./tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { WorkFlow } from "./workflow";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

const contextRetriever = new ContextRetriever(
    "https://www.typescriptlang.org/docs/handbook/"
);
const tools = [contextRetriever];
const toolNode = new ToolNode(tools);

const newWorkflow = WorkFlow(toolNode);
const checkPointer = new MemorySaver();

const app = newWorkflow.compile({ checkpointer: checkPointer });

const final_messages = app.invoke({
    messages: [
        new HumanMessage({ content: "What are TypeScript primitive types" }),
    ],
});

console.log(final_messages["messages"][-1].content)