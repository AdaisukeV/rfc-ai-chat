import { embed } from 'ai';
//import { google } from '@ai-sdk/google';
//import { openai } from '@ai-sdk/openai';

//const embeddingModel = google.textEmbeddingModel('text-embedding-004'); // GeminiのEmbeddingモデル
const embeddingModel = 'openai:text-embedding-3-small'; // OpenAIのEmbeddingモデル

export async function embedText(text: string): Promise<number[]> {
    const result = await embed({ 
        model: embeddingModel,
        value: text
    });
    return result.embedding;
}
