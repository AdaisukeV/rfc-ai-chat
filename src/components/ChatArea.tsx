import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@ai-sdk/react';

export function ChatArea({ messages }: { messages: Message[] }) {
  return (
    <Card className="flex flex-col flex-1 h-full bg-zinc-950 border-0">
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
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {message.parts?.map((part, i) => {
                    if (part.type === "text" && "text" in part) {
                      return (
                        <ReactMarkdown
                          key={`${message.id}-${i}`}
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            p({ node, children }) {
                              // nodeがnullまたはpositionがnullの場合、デフォルトのスタイルを適用
                              if (!node || !node.position || !node.position.start) {
                                return <p style={{ margin: "0 0 0 0" }}>{children}</p>;
                              }
                              // 最初の段落の場合marginを0にし、以降の段落は1emのマージンを適用
                              const isFirstParagraph = node.position.start.line === 1;
                              return (
                                <p style={{ margin: isFirstParagraph ? "0 0 0 0" : "1em 0 0 0" }}>
                                  {children}
                                </p>
                              );
                            },
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
                              return <ul className="list-disc pl-5">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-5">{children}</ol>;
                            },
                            a({ href, children }) {
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#3b82f6",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}