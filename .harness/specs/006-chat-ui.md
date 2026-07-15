---
status: completed
created: 2026-07-14
---

# Spec: feat/006-chat-ui

## 1. Overview

Build the conversational chat interface for interacting with uploaded PDF documents. Users type questions, the system responds with AI-generated answers based on selected files. This phase delivers the UI shell with a stub API; the actual RAG pipeline (vector search + LLM) is implemented in feat/007.

## 2. Acceptance Criteria

- [ ] Chat panel replaces the welcome placeholder in the main content area
- [ ] Chat input (textarea + send button) at the bottom of the chat panel
- [ ] Messages display as a scrollable list with user/assistant bubbles
- [ ] Auto-scroll to bottom on new messages
- [ ] Send button disabled when no files selected or during streaming
- [ ] File context indicator showing selected file count above input
- [ ] Empty state: "Select files and ask a question" when no messages
- [ ] Loading indicator while assistant response is pending
- [ ] POST /api/chat endpoint returns stub response
- [ ] Chat messages stored in Zustand (no DB persistence yet)
- [ ] Enter to send, Shift+Enter for newline
- [ ] All UI text in English
- [ ] Lint passes: bun run lint
- [ ] Type check passes: bun x tsc --noEmit
- [ ] Tests pass: bun test

## 3. Architecture

### Types & Interfaces

```typescript
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatRequest {
  message: string;
  fileIds: string[];
}

interface ChatResponse {
  content: string;
}
```

### File Structure

```
src/
├── app/api/chat/
│   └── route.ts                    # POST - Chat endpoint (stub)
├── features/chat/
│   ├── components/
│   │   ├── chat-container.tsx      # Main chat layout
│   │   ├── chat-message-list.tsx   # Scrollable message list
│   │   ├── chat-message-item.tsx   # Individual message bubble
│   │   ├── chat-input.tsx          # Textarea + send button
│   │   ├── chat-empty-state.tsx    # No-messages placeholder
│   │   └── chat-loading.tsx        # Typing indicator
│   ├── hooks/
│   │   ├── use-chat.ts             # Send messages hook
│   │   └── use-chat-scroll.ts      # Auto-scroll hook
│   └── types/
│       └── chat.ts                 # ChatMessage, ChatRequest types
├── stores/
│   └── chat.ts                     # Zustand chat store
```

## 4. UI Design

### Chat Panel Layout

```
┌─────────────────────────────────────────────┐
│  Main Content Area                          │
│  ┌─────────────────────────────────────────┐│
│  │  Chat Messages (scrollable)             ││
│  │                                         ││
│  │  ┌──────────────────────┐               ││
│  │  │ What is this PDF     │  user msg     ││
│  │  │ about?          [You]│               ││
│  │  └──────────────────────┘               ││
│  │                                         ││
│  │  ┌──────────────────────┐               ││
│  │  │ This PDF discusses   │               ││
│  │  │ [AI] quarterly       │  ai msg       ││
│  │  │ results...           │               ││
│  │  └──────────────────────┘               ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ 📎 2 files selected                     ││
│  │ ┌───────────────────────┐ ┌──┐          ││
│  │ │ Ask a question...     │ │> │          ││
│  │ └───────────────────────┘ └──┘          ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## 5. Implementation Notes

1. **No DB persistence**: Messages live in Zustand store only. The ChatMessage Prisma model will be adapted in feat/007.
2. **Stub API**: POST /api/chat returns a placeholder response. feat/007 wires RAG pipeline.
3. **Streaming-ready UI**: The UI will support appending content character-by-character, but the stub API returns a full response.
4. **File selection**: Chat input is disabled when `selectedFileIds` is empty.
5. **No markdown rendering**: Plain text for now. Enhancement in feat/007/008.

## 6. Verification

```bash
bun run format
bun run lint
bun x tsc --noEmit
bun test
```

## 7. Dependencies

- feat/002-layout-providers (Providers wrapper, shadcn)
- feat/005-file-management (file selection store, selectedFileIds)
