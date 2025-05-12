'use client';

import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // 学習済みRFCの番号一覧
  const rfcNumbers = [1939, 2045, 2046, 2047, 2048, 2049, 2505, 3461, 3464, 3501, 3798, 4409, 5321, 5322, 5617, 5751, 5788, 6376, 6530, 6531, 6532, 6533, 7208, 7489, 8058, 8463, 8551, 8616, 8617];

  // テキストエリアの高さを動的に調整する関数
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // 高さをリセット
    e.target.style.height = `${e.target.scrollHeight}px`; // 内容に応じた高さを設定
  };

  // Enterキーで送信する関数
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // デフォルトの改行動作を防ぐ
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // handleSubmitを呼び出す
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl py-5 mx-auto">
      <div className="flex flex-row w-full max-w-6xl mx-auto h-screen">
        {/* メインチャットエリア */}
        <div className="flex flex-col flex-1">
          <Card className="flex flex-col h-full bg-zinc-950 border-0">
            <CardHeader>
              <CardTitle>RFC AIチャット</CardTitle>
              <CardDescription>
                メールやネットワーク周りの仕様について質問してください。RFCの内容に基づいて質問に答えます。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-800 text-white'
                        }`}
                      >
                        {message.parts.map((part, i) => {
                          if (part.type === 'text' && 'text' in part) {
                            return (
                              <ReactMarkdown
                                key={`${message.id}-${i}`}
                                remarkPlugins={[remarkGfm]} // GFM対応を追加
                                components={{
                                  code({ inline, children }: { inline?: boolean; children?: React.ReactNode }) {
                                    if (inline) {
                                      return (
                                        <code className="bg-zinc-900 text-red-500">
                                          {children}
                                        </code>
                                      );
                                    }
                                    return (
                                      <code className="bg-zinc-900 text-white p-2 rounded block">
                                        {children}
                                      </code>
                                    );
                                  },
                                  ul({ children }) {
                                    // 箇条書きリストのカスタマイズ
                                    return <ul className="list-disc pl-5">{children}</ul>;
                                  },
                                  ol({ children }) {
                                    // 番号付きリストのカスタマイズ
                                    return <ol className="list-decimal pl-5">{children}</ol>;
                                  },
                                  a({ href, children }) {
                                    // リンク文字列のハイライト
                                    return (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          color: '#3b82f6', // 青色
                                          textDecoration: 'underline', // 下線を追加
                                        }}
                                      >
                                        {children}
                                      </a>
                                    );
                                  }
                                }}
                              >
                                {part.text}
                              </ReactMarkdown>
                            );
                          }
                          return null; // 他の型の場合は何もレンダリングしない
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 学習済みRFCの番号一覧 */}
        <Card className="w-80 bg-zinc-950 border-0">
          <CardHeader>
            <CardTitle>学習済みRFC一覧</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <ul className="list-disc pl-5">
              {rfcNumbers.map((rfcNumber) => (
                <li key={rfcNumber}>
                  <a
                    href={`https://datatracker.ietf.org/doc/html/rfc${rfcNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    RFC {rfcNumber}
                  </a>
              </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 質問入力フォーム */}
      <div className="fixed bottom-0 left-0 w-full bg-zinc-950 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 w-full max-w-4xl mx-auto items-center"
        >
          <textarea
            value={input}
            onChange={(e) => {
              handleInputChange(e);
              adjustTextareaHeight(e); // 高さを調整
            }}
            onKeyDown={handleKeyDown} // Enterキーで送信
            placeholder="こちらから質問してください"
            className="flex-1 placeholder:text-zinc-400 resize-none overflow-hidden p-2 border rounded"
            rows={1} // 初期行数
          />
          <Button
            type="submit"
            disabled={!input.trim()} // 入力が空の場合はボタンを無効化
            className={`p-2 rounded ${
              input.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            質問する
          </Button>
        </form>
      </div>
    </div>
  );
}