import { embed } from 'ai';
//import { google } from '@ai-sdk/google';
//import { openai } from '@ai-sdk/openai';

//const embeddingModel = google.textEmbeddingModel('text-embedding-004'); // GeminiのEmbeddingモデル
// AI SDK v5では、モデルIDを文字列で直接指定できます
// プロバイダー修飾されたモデルIDを使用します
const embeddingModel = 'openai:text-embedding-3-small'; // OpenAIのEmbeddingモデル

export async function embedText(text: string): Promise<number[]> {
    const result = await embed({ 
        model: embeddingModel,
        value: text
    });
    return result.embedding;
}
