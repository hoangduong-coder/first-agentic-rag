import { END, START, StateGraph, MessagesAnnotation, Annotation } from "@langchain/langgraph"
import { ContextRetriever } from "./tools"
import { ChatOpenAI } from "@langchain/openai"
import { ToolNode } from "@langchain/langgraph/prebuilt"

export const WorkFlow = (toolNode: ToolNode) => {
    const shouldContinueWorkflow = (state: typeof MessagesAnnotation.State) => {
        const messages = state.messages
        const lastMessage = messages[messages.length - 1]
        if (lastMessage && "toolCalls" in lastMessage)
            return "tools"
        return END
    }
    
    const model = (tools: ContextRetriever[]) => {
        return new ChatOpenAI({model: "gpt-4o-mini", temperature: 0}).bindTools(tools)
    } 
    
    const callModel = async (state: typeof MessagesAnnotation.State, tools: ContextRetriever[]) => {
        const messages = state.messages
        const newModel = model(tools)
        const response = await newModel.invoke(messages)
        return {"messages": [response]}
    }
    
    const GraphAnnotation = Annotation.Root({
        language: Annotation<string>(),
        ...MessagesAnnotation.spec,
      });
    
    const workflow = new StateGraph(GraphAnnotation)
    
    workflow.addNode("agent", callModel)
    workflow.addNode("tools", toolNode)

    workflow.addEdge(START, "agent")
    workflow.addConditionalEdges("agent", shouldContinueWorkflow)
    workflow.addEdge("tools", "agent")

    return workflow
}