"use client";

import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chat";
import { useFileSelection } from "@/stores/file-selection";
import type { ChatMessage, ChatResponse } from "../types/chat";

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
      return response.json() as Promise<ChatResponse>;
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
    onSuccess: (data) => {
      updateLastMessage(data.content);
      setStreaming(false);
    },
    onError: () => {
      updateLastMessage("Sorry, something went wrong. Please try again.");
      setStreaming(false);
    },
  });
}
