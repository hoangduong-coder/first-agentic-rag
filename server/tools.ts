import { Tool } from "@langchain/core/tools"
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { OpenAIEmbeddings } from "@langchain/openai"

export class ContextRetriever extends Tool {
    name = "context_retriever";
    description = "Retrieves relevant context from a given URL based on a query.";
    
    private url: string

    constructor(url: string) {
        super()
        this.url = url 
    }

    async _call(query: string): Promise<string> {
        const compiledConvert = compile({wordwrap: 130})
        const loader = new RecursiveUrlLoader(this.url, {
            extractor: compiledConvert
        })
        const docs = await loader.load()
        const embeddings = new OpenAIEmbeddings()
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 100,
            chunkOverlap: 50
        })
        const doc_chunks = await splitter.splitDocuments(docs)
        const vectorStore = await Chroma.fromDocuments(doc_chunks, embeddings, {collectionName: "typescript-docs"})
        const retriever = vectorStore.asRetriever()
        const results = await retriever.invoke(query)

        return results.map((result) => result.pageContent).join("\n")
    }
}