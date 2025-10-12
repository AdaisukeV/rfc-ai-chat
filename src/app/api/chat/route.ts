import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createUIMessageStreamResponse } from 'ai';
import { UIMessage } from '@ai-sdk/react';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { createVectorStore } from "@/app/utils/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { translateToEng } from '@/app/utils/translate';
import { buildPrompt } from '@/app/utils/prompt'; // プロンプト生成関数

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // リクエストから質問を取得
        const { messages }: { messages: UIMessage[] } = await req.json();
        console.log('Received messages:', messages);

        // 最新の質問を取得
        const lastMessage = messages[messages.length - 1];
        let question: string | undefined;
        if (lastMessage?.parts && Array.isArray(lastMessage.parts)) {
            question = lastMessage.parts.map((part: any) => part.text).filter(Boolean).join(' ');
        }
        if (!question) {
            return new Response('No question provided', { status: 400 });
        }
        console.log('Question:', question);

        // 質問を英語に翻訳
        const translatedQuestion = await translateToEng(question);
        console.log('Translated question:', translatedQuestion);

        // LangChainのGoogle Vertex AI埋め込みモデルを使用
        //const embeddings = new VertexAIEmbeddings({
        //    model: 'text-embedding-004', // Google Generative AIの埋め込みモデル
        //});
        
        // LangChainのOpenAI埋め込みモデルを使用
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small"
        });

        // Pineconeのインデックスを使用してベクトルストアを作成
        const vectorStore = await createVectorStore(embeddings);

        // 質問をベクトル化して検索
        // https://js.langchain.com/docs/concepts/vectorstores#similarity-search
        // TODO: LangChain経由でPineconeにUpsertしてみる
        const searchResults = await vectorStore.similaritySearch(
            translatedQuestion,
            20
        );
        console.log('Search results:', searchResults);

        // 検索結果からコンテキストと引用元を抽出
        const contexts = searchResults.map(result => {
            const rfcNumber = result.metadata?.rfc_number;
            const sectionAnchor = result.metadata?.section_anchor;
            const url = `https://datatracker.ietf.org/doc/html/rfc${rfcNumber}#${sectionAnchor}`;
            return `${result.pageContent}\n\n[参照: ${url}]`; // コンテキストにURLを含める
        }).join('\n----------------------------------------------------------------------------\n');
        console.log('Contexts:', contexts);

        // プロンプトを生成
        const prompt = buildPrompt(contexts, question);
        console.log('prompt: ',prompt);

        // AIモデルで回答を生成
        const llm = new ChatGoogleGenerativeAI({ 
            model: "gemini-2.5-flash",
            //temperature: 2.0
        })
        //const llm = new ChatOpenAI({ model: "gpt-4" })
        const stream = await llm.stream(prompt);
        //const stream = await llm.stream(question); // ベクトル検索せずに質問をそのまま投げる

        // クライアントに回答を返す
        return createUIMessageStreamResponse({
            stream: toUIMessageStream(stream)
        }); // https://sdk.vercel.ai/docs/reference/stream-helpers/langchain-adapter
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}