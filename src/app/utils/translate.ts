// import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function translateToEng(input: string): Promise<string> {
    const result = await generateText({
        // AI SDK v5では、プロバイダー修飾されたモデルIDを文字列で直接指定できます
        model: 'google:models/gemini-2.5-flash',
        prompt: `Translate the following question to English:\n\n"${input}"`,
    });

    return result.text.trim();
}