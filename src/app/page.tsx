'use client';

import { useChat } from '@ai-sdk/react';
import { ChatArea } from '../components/ChatArea';
import { RfcList } from '../components/RfcList';
import { QuestionForm } from '../components/QuestionForm';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // 学習済みRFCの番号一覧
  const rfcNumbers = [
    1939, 2045, 2046, 2047, 
    2048, 2049, 2505, 3461, 
    3464, 3501, 3798, 4409, 
    5321, 5322, 5617, 5751, 
    5788, 6376, 6530, 6531, 
    6532, 6533, 7208, 7489, 
    8058, 8463, 8551, 8616, 
    8617
  ];

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
        <ChatArea messages={messages} />
        <RfcList rfcNumbers={rfcNumbers} />
      </div>
      <QuestionForm
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        adjustTextareaHeight={adjustTextareaHeight}
      />
    </div>
  );
}