import { ChatVertexAI } from "@langchain/google-vertexai";
import { getVertexAIAuth } from '@/app/utils/vertexai-config';

export async function translateToEng(input: string): Promise<string> {
    const authConfig = getVertexAIAuth();
    const llm = new ChatVertexAI({
        model: "gemini-2.5-flash",
        ...authConfig,
    });
    
    const result = await llm.invoke(
        `Translate the following question to English:\n\n"${input}"`
    );

    return result.content.toString().trim();
}