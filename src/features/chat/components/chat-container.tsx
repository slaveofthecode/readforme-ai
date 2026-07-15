import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";

export function ChatContainer() {
  return (
    <div className="flex flex-col h-full">
      <ChatMessageList />
      <ChatInput />
    </div>
  );
}
