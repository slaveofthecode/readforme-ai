import { describe, test, expect, beforeEach } from "bun:test";
import { useChatStore } from "./chat";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useChatStore.getState().setStreaming(false);
  });

  test("initializes with empty messages", () => {
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.isStreaming).toBe(false);
  });

  test("addMessage appends a message", () => {
    const { addMessage } = useChatStore.getState();
    addMessage({
      id: "1",
      role: "user",
      content: "Hello",
      createdAt: new Date(),
    });
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0].content).toBe("Hello");
  });

  test("addMessage appends multiple messages", () => {
    const { addMessage } = useChatStore.getState();
    addMessage({
      id: "1",
      role: "user",
      content: "Hello",
      createdAt: new Date(),
    });
    addMessage({
      id: "2",
      role: "assistant",
      content: "Hi there",
      createdAt: new Date(),
    });
    expect(useChatStore.getState().messages).toHaveLength(2);
  });

  test("updateLastMessage updates assistant content", () => {
    const { addMessage, updateLastMessage } = useChatStore.getState();
    addMessage({
      id: "1",
      role: "user",
      content: "Hello",
      createdAt: new Date(),
    });
    addMessage({
      id: "2",
      role: "assistant",
      content: "",
      createdAt: new Date(),
    });
    updateLastMessage("Updated response");
    expect(useChatStore.getState().messages[1].content).toBe(
      "Updated response",
    );
  });

  test("updateLastMessage does not update user messages", () => {
    const { addMessage, updateLastMessage } = useChatStore.getState();
    addMessage({
      id: "1",
      role: "user",
      content: "Original",
      createdAt: new Date(),
    });
    updateLastMessage("Should not change");
    expect(useChatStore.getState().messages[0].content).toBe("Original");
  });

  test("setStreaming toggles streaming state", () => {
    const { setStreaming } = useChatStore.getState();
    setStreaming(true);
    expect(useChatStore.getState().isStreaming).toBe(true);
    setStreaming(false);
    expect(useChatStore.getState().isStreaming).toBe(false);
  });

  test("clearMessages removes all messages", () => {
    const { addMessage, clearMessages } = useChatStore.getState();
    addMessage({
      id: "1",
      role: "user",
      content: "Hello",
      createdAt: new Date(),
    });
    clearMessages();
    expect(useChatStore.getState().messages).toEqual([]);
  });
});
