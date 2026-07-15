---
status: completed
created: 2026-07-15
---

# Spec: feat/007-rag-pipeline

## 1. Overview

Wire the full RAG pipeline: embed user query, search similar chunks via pgvector, build context prompt, generate answer with Gemini streaming. Connects the chat UI (feat/006) to the document embeddings (feat/004).

## 2. Acceptance Criteria

- [ ] Re-create dropped HNSW index for vector search performance
- [ ] Add generateQueryEmbedding function with RETRIEVAL_QUERY task type
- [ ] Create vector-search utility for cosine similarity search
- [ ] POST /api/chat performs full RAG: embed -> search -> prompt -> stream
- [ ] Streaming response via ReadableStream/SSE to client
- [ ] useChat hook refactored for incremental streaming updates
- [ ] Sources (file name, page number) included in response
- [ ] ChatResponse type extended with ChatSource[]
- [ ] Top K=5 chunks retrieved with similarity filtering
- [ ] System prompt includes retrieved context with citations
- [ ] All UI text in English
- [ ] Lint passes: bun run lint
- [ ] Type check passes: bun x tsc --noEmit
- [ ] Tests pass: bun test

## 3. Architecture

### Data Flow

```
User types question
  -> POST /api/chat { message, fileIds }
  -> Embed query (RETRIEVAL_QUERY)
  -> Vector search: top 5 chunks from selected files
  -> Build RAG prompt with context
  -> Gemini 1.5 Flash streaming
  -> Stream chunks to client via SSE
  -> useChat hook appends to Zustand store incrementally
```

### File Structure

```
src/
├── lib/
│   ├── vector-search.ts          # Cosine similarity search
│   └── embedding.ts              # Add generateQueryEmbedding
├── app/api/chat/
│   └── route.ts                  # Full RAG + streaming
├── features/chat/
│   ├── hooks/use-chat.ts         # Refactored for streaming
│   └── types/chat.ts             # Add ChatSource type
└── migrations/
    └── YYYYMMDD_restore_hnsw_index/
```

## 4. Implementation Notes

1. **HNSW index**: Re-create with `CREATE INDEX ... USING hnsw (embedding vector_cosine_ops)`
2. **Query embedding**: Use `taskType: "RETRIEVAL_QUERY"` (different from ingestion's `RETRIEVAL_DOCUMENT`)
3. **Vector search**: Raw SQL with `<=>` cosine distance operator, filter by fileId, deletedAt, status
4. **Streaming**: Use `generateContentStream()` from Gemini SDK, return `ReadableStream`
5. **Client parsing**: Parse SSE `data:` lines, call `updateLastMessage` incrementally
6. **Top K**: 5 chunks with distance threshold (optional)
7. **Model**: gemini-1.5-flash for chat responses

## 5. Verification

```bash
bun run format
bun run lint
bun x tsc --noEmit
bun test
```

## 6. Dependencies

- feat/004-file-upload (embeddings stored in pgvector)
- feat/005-file-management (file selection)
- feat/006-chat-ui (chat UI shell)
