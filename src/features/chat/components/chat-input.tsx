"use client";

import { useState, type KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useFileSelection } from "@/stores/file-selection";
import { useChatStore } from "@/stores/chat";
import { useChat } from "../hooks/use-chat";

export function ChatInput() {
  const [input, setInput] = useState("");
  const selectedFileIds = useFileSelection((s) => s.selectedFileIds);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const sendMessage = useChat();
  const hasFiles = selectedFileIds.length > 0;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !hasFiles || isStreaming) return;
    sendMessage.mutate(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasFiles
              ? "Ask a question about your files..."
              : "Select files first to start chatting"
          }
          disabled={!hasFiles || isStreaming}
          className="min-h-10 max-h-32 resize-none"
          rows={1}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || !hasFiles || isStreaming}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {hasFiles && (
        <p className="text-xs text-muted-foreground mt-1">
          {selectedFileIds.length} file{selectedFileIds.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      )}
    </div>
  );
}
