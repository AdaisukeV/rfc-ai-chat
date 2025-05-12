// This file is responsible for creating a Pinecone client and initializing the vector store.
// https://js.langchain.com/docs/integrations/vectorstores/pinecone/
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { EmbeddingsInterface } from "@langchain/core/embeddings";

const pinecone = new Pinecone();
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

export async function createVectorStore(embeddingModel: EmbeddingsInterface) {
    return await PineconeStore.fromExistingIndex(embeddingModel, {
        pineconeIndex,
        //namespace: "email" // namespaceを明示しないと、検索時にヒットしない
    });
}