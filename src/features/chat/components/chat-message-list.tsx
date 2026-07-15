import { useChatStore } from "@/stores/chat";
import { useChatScroll } from "../hooks/use-chat-scroll";
import { ChatMessageItem } from "./chat-message-item";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatLoading } from "./chat-loading";

export function ChatMessageList() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const containerRef = useChatScroll(messages.length, isStreaming);

  if (messages.length === 0) {
    return <ChatEmptyState />;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      {isStreaming && messages[messages.length - 1]?.content === "" && (
        <ChatLoading />
      )}
    </div>
  );
}
