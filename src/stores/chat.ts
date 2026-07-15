"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/features/chat/types/chat";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content };
      }
      return { messages };
    }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  clearMessages: () => set({ messages: [] }),
}));
