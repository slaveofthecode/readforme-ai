"use client";

import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chat";
import { useFileSelection } from "@/stores/file-selection";
import type { ChatMessage, ChatSource } from "../types/chat";

export function useChat() {
  const { addMessage, updateLastMessage, setStreaming } = useChatStore();
  const selectedFileIds = useFileSelection((s) => s.selectedFileIds);

  return useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, fileIds: selectedFileIds }),
      });
      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let content = "";
      let sources: ChatSource[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data) as
              { text: string } | { sources: ChatSource[] } | { error: string };
            if ("text" in parsed) {
              content += parsed.text;
              updateLastMessage(content);
            } else if ("sources" in parsed) {
              sources = parsed.sources;
            } else if ("error" in parsed) {
              throw new Error(parsed.error);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      return { content, sources };
    },
    onMutate: (message) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        createdAt: new Date(),
      };
      addMessage(userMsg);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };
      addMessage(assistantMsg);
      setStreaming(true);
    },
    onSuccess: () => {
      setStreaming(false);
    },
    onError: () => {
      updateLastMessage("Sorry, something went wrong. Please try again.");
      setStreaming(false);
    },
  });
}
