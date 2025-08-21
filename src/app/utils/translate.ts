import { ChatVertexAI } from "@langchain/google-vertexai";

export async function translateToEng(input: string): Promise<string> {
    const llm = new ChatVertexAI({
        model: "gemini-2.5-flash",
    });
    
    const result = await llm.invoke(
        `Translate the following question to English:\n\n"${input}"`
    );

    return result.content.toString().trim();
}