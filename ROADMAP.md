# ROADMAP — ReadForMe AI

> Master plan for the application. This file tracks ALL features from idea to completion.
>
> Updated by the AI at the start of each session and when features are completed.

---

## Feature Overview

| #   | Feature               | Branch                      | Status       | Depends On | Spec                                     |
| --- | --------------------- | --------------------------- | ------------ | ---------- | ---------------------------------------- |
| 001 | Scaffolding           | `feat/001-scaffolding`      | ✅ completed | —          | —                                        |
| 002 | Layout & Providers    | `feat/002-layout-providers` | ✅ completed | 001        | `.harness/specs/002-layout-providers.md` |
| 003 | Database Schema       | `feat/003-database-schema`  | ⏳ pending   | 002        | `.harness/specs/003-database-schema.md`  |
| 004 | File Upload           | `feat/004-file-upload`      | ⏳ pending   | 002, 003   | `.harness/specs/004-file-upload.md`      |
| 005 | File Management       | `feat/005-file-management`  | ⏳ pending   | 002, 003   | `.harness/specs/005-file-management.md`  |
| 006 | Chat UI               | `feat/006-chat-ui`          | ⏳ pending   | 002        | `.harness/specs/006-chat-ui.md`          |
| 007 | RAG Pipeline          | `feat/007-rag-pipeline`     | ⏳ pending   | 003, 006   | `.harness/specs/007-rag-pipeline.md`     |
| 008 | Polish & Optimization | `feat/008-polish`           | ⏳ pending   | All        | —                                        |

### Status Legend

- ✅ **completed** — Feature merged to master
- 🔄 **in-progress** — Active development on feature branch
- ⏳ **pending** — Not started, waiting for dependencies
- 🚫 **blocked** — Started but blocked by dependency or issue

---

## Feature Details

### 001 — Scaffolding ✅

**Goal:** Project setup with Next.js, Tailwind, shadcn, Prisma, Gemini SDK.

**Deliverables:**

- Next.js 16 with App Router
- Tailwind CSS 4 configured
- 18 shadcn/ui components installed
- Prisma singleton (`lib/prisma.ts`)
- Gemini SDK client (`lib/gemini.ts`)
- `cn()` utility (`lib/utils.ts`)
- Full harness system (agents, skills, commands)

**Completed:** 2025-07-10

---

### 002 — Layout & Providers ✅

**Goal:** App shell with global providers and responsive layout.

**Deliverables:**

- Providers wrapper (QueryClientProvider, ThemeProvider, Toaster)
- Responsive sidebar (256px desktop, hamburger mobile)
- Main content area
- shadcn CSS variables for light/dark theme
- Updated metadata (title, description)

**Spec:** `.harness/specs/002-layout-providers.md`

**Branch:** `feat/002-layout-providers`

**Completed:** 2026-07-13

---

### 003 — Database Schema ⏳

**Goal:** Define all Prisma models and run initial migration.

**Deliverables:**

- `File` model (id, name, size, status, pageCount, createdAt)
- `Chunk` model (id, fileId, text, embedding vector(768), pageNumber, chunkIndex)
- `ChatMessage` model (id, role, content, fileId, createdAt)
- pgvector extension enabled
- HNSW index on embedding column
- Initial migration

**Spec:** `.harness/specs/003-database-schema.md` (to be created)

---

### 004 — File Upload ⏳

**Goal:** PDF upload, text extraction, chunking, embedding generation.

**Deliverables:**

- Drag-and-drop upload UI
- API route `/api/upload`
- PDF text extraction (pdfjs-dist)
- Text chunking with overlap (500-1000 tokens)
- Embedding generation (Gemini text-embedding-004)
- Store chunks with embeddings in pgvector
- Upload progress indicator

**Spec:** `.harness/specs/004-file-upload.md` (to be created)

---

### 005 — File Management ⏳

**Goal:** List, select, and manage uploaded files.

**Deliverables:**

- File list with status indicators
- Multi-select checkboxes for RAG context
- Delete file functionality
- File status display (processing, ready, error)
- TanStack Query for file list fetching

**Spec:** `.harness/specs/005-file-management.md` (to be created)

---

### 006 — Chat UI ⏳

**Goal:** Conversational interface for chatting with documents.

**Deliverables:**

- Chat message list
- Input textarea with send button
- Streaming response display
- Message history (Zustand store)
- File selection context indicator

**Spec:** `.harness/specs/006-chat-ui.md` (to be created)

---

### 007 — RAG Pipeline ⏳

**Goal:** Vector search, context retrieval, and LLM response generation.

**Deliverables:**

- Query embedding generation
- Cosine similarity search (top K chunks)
- Context formatting for LLM prompt
- Gemini 1.5 Flash response generation with streaming
- Citations referencing source file and page
- API route `/api/chat`

**Spec:** `.harness/specs/007-rag-pipeline.md` (to be created)

---

### 008 — Polish & Optimization ⏳

**Goal:** Error handling, loading states, edge cases, performance.

**Deliverables:**

- Loading skeletons for all async operations
- Error boundaries and fallback UI
- Empty states for lists
- Rate limit handling for Gemini API
- PDF processing error handling
- Performance optimization (lazy loading, memoization)

---

## Dependency Graph

```
001 Scaffolding
  └── 002 Layout & Providers
        ├── 003 Database Schema
        │     ├── 004 File Upload
        │     │     └── 005 File Management
        │     └── 007 RAG Pipeline
        └── 006 Chat UI
              └── 007 RAG Pipeline
                    └── 008 Polish
```

---

## Notes

- Each feature follows SDD: spec first, then implementation
- Specs live in `.harness/specs/`
- Status is tracked in this file AND in each spec's frontmatter
- Harness improvements (bugs) are tracked in `.harness/registry.md`
