import React from "react";
import { Button } from "@/components/ui/button";

export function QuestionForm({
  input,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
  adjustTextareaHeight,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  adjustTextareaHeight: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 w-full max-w-4xl mx-auto items-center"
      >
        <textarea
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            adjustTextareaHeight(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder="こちらから質問してください（例：メールが送信される仕組みを教えてください）"
          className="flex-1 placeholder:text-zinc-400 resize-none overflow-hidden p-2 border rounded"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!input.trim()}
          className={`p-2 rounded ${
            input.trim() ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"
          }`}
        >
          質問する
        </Button>
      </form>
    </div>
  );
}