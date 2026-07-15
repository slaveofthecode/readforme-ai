# Lessons Learned

> Registry of errors, causes, fixes, and lessons so neither the AI nor the human repeat the same mistakes in future phases.
>
> Both the AI and the human can add entries here. The AI reads this file at the start of every session and must register any errors it identifies during development before fixing them. The human can add entries when reviewing PRs or discovering issues the AI missed.

## Entry Format

```markdown
## bug/NNN-<phase-name> — YYYY-MM-DD

### Error: short error title

- **Context:** when and where it happened
- **Cause:** what originated it
- **Fix:** what was done to resolve it
- **Lesson:** what must be done next time to avoid it
- **Author:** AI | Human
```

## AI Registration Protocol

When the AI identifies an error during development (type error, logic mistake, anti-pattern, failed test, incorrect assumption, lint violation), it MUST:

1. Register the entry in this file **before** fixing the error
2. Include all fields with `Author: AI`
3. Continue with the fix
4. Reference this lesson at the start of future sessions to avoid repetition

## Human Registration Protocol

When reviewing a PR or discovering an issue the AI missed, the human should:

1. Add an entry with `Author: Human`
2. Include as much context as possible (file, line, scenario)
3. The AI will read and learn from this entry in future sessions

---

## bug/002-harness-improvements — 2026-07-13

### Error: Making changes directly on master branch

- **Context:** Applied harness improvements (lessons-learned.md, AGENTS.md, registry.md) directly on master instead of creating a feature/bug branch first
- **Cause:** Did not follow the branching protocol — all changes must go through a branch and PR, never directly on master
- **Fix:** Reverted changes on master, created bug/002-harness-improvements branch, re-applied changes there
- **Lesson:** NEVER make changes on master. Always create a branch first (feat/ or bug/). Master is only modified via merged PRs.
- **Author:** AI

## bug/003-harness-specs — 2026-07-13

### Error: Creating PR without explicit user authorization

- **Context:** After user authorized commit ("The changes are ready to commit"), AI also created the PR without waiting for explicit `/pr` command
- **Cause:** Misinterpreted user's commit authorization as authorization for all git write operations. PR creation is a SEPARATE action that requires its own explicit authorization via `/pr`
- **Fix:** Asked user about the mistake, will delete the unauthorized PR
- **Lesson:** NEVER create a PR unless user explicitly types `/pr`. Commit authorization ≠ PR authorization. Each git write operation (commit, push, PR) requires separate explicit authorization.
- **Author:** AI

## bug/005-hydration-fix — 2026-07-13

### Error: Hydration mismatch caused by browser extensions

- **Context:** User tested app on mobile browser with Grammarly extension, got hydration error
- **Cause:** Browser extensions (Grammarly, etc.) add attributes to DOM elements after server render, causing React hydration mismatch
- **Fix:** Added `suppressHydrationWarning` prop to `<body>` tag in layout.tsx
- **Lesson:** Always add `suppressHydrationWarning` to both `<html>` and `<body>` tags when building Next.js apps that will be used in browsers with extensions
- **Author:** AI

## feat/003-database-schema — 2026-07-13

### Error: Prisma 7 config requires datasource URL in prisma.config.ts

- **Context:** Running `bunx prisma migrate dev` failed with "The datasource.url property is required in your Prisma config file"
- **Cause:** Prisma 7 with `prisma.config.ts` requires explicit datasource URL configuration, unlike Prisma 5/6 which auto-read from .env
- **Fix:** Added `datasource: { url: process.env.DATABASE_URL! }` to prisma.config.ts
- **Lesson:** When using Prisma 7 with `prisma.config.ts`, always include datasource URL configuration. The `earlyAccess` property does not exist in PrismaConfig type.
- **Author:** AI

### Error: Providers component imported but not used in layout.tsx

- **Context:** ESLint warning "Providers is defined but never used" after adding import
- **Cause:** The Providers component was imported from the scaffolding phase but never wrapped around children in the layout
- **Fix:** Wrapped `{children}` with `<Providers>{children}</Providers>` in the body tag
- **Lesson:** Always verify component imports are actually used. If a component is imported, it should be used or the import should be removed.
- **Author:** AI

## feat/004-file-upload — 2026-07-14

### Error: Prisma 7 Chunk model missing create/createMany methods

- **Context:** Attempting to use `prisma.chunk.create()` or `prisma.chunk.createMany()` to insert chunks with vector embeddings
- **Cause:** Prisma 7 models with `Unsupported("vector")` type columns do not expose `create` or `createMany` methods on the delegate
- **Fix:** Use `prisma.$executeRaw` with raw SQL INSERT statements for models containing unsupported types
- **Lesson:** When using Prisma with `Unsupported()` type columns (like pgvector), use raw SQL queries for INSERT operations instead of the standard Prisma Client methods
- **Author:** AI

### Error: React hook ordering violation (pollFileStatus accessed before declaration)

- **Context:** ESLint error "Cannot access variable before it is declared" when calling `pollFileStatus` inside `handleFile` callback
- **Cause:** `pollFileStatus` was declared after `handleFile` but called inside it, violating React's hook ordering rules
- **Fix:** Reordered hooks so `pollFileStatus` is declared before `handleFile`, and added `pollFileStatus` to `handleFile`'s dependency array
- **Lesson:** When using multiple useCallback hooks that reference each other, declare them in dependency order. Hooks that are called by other hooks must be declared first.
- **Author:** AI

### Error: Gemini SDK TaskType requires enum import

- **Context:** TypeScript error "Type string is not assignable to type TaskType" when using string literal "RETRIEVAL_DOCUMENT"
- **Cause:** The Gemini SDK uses a TypeScript enum for TaskType, not string literals
- **Fix:** Import `TaskType` from `@google/generative-ai` and use `TaskType.RETRIEVAL_DOCUMENT` instead of the string literal
- **Lesson:** When using third-party SDKs with TypeScript enums, always import and use the enum values directly instead of string literals
- **Author:** AI

### Error: PrismaClient initialization error with Query Compiler

- **Context:** `PrismaClientInitializationError` when calling API routes - "PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions"
- **Cause:** Prisma 7 with Query Compiler enabled (default) requires a driver adapter to be passed to PrismaClient
- **Fix:** Install `@prisma/adapter-pg` and `pg`, then initialize PrismaClient with `new PrismaPg({ connectionString: process.env.DATABASE_URL })` adapter
- **Lesson:** Prisma 7 requires driver adapters. Always install `@prisma/adapter-pg` (or relevant adapter) and pass it to PrismaClient constructor
- **Author:** AI

### Error: pdfjs-dist DOMMatrix is not defined in Node.js

- **Context:** `ReferenceError: DOMMatrix is not defined` when running pdfjs-dist in Next.js API routes (server-side)
- **Cause:** pdfjs-dist default build uses browser APIs (DOMMatrix, Path2D) that don't exist in Node.js
- **Fix:** Import from `pdfjs-dist/legacy/build/pdf.mjs` instead of `pdfjs-dist` to use the Node.js-compatible legacy build
- **Lesson:** When using pdfjs-dist in server-side code (Next.js API routes, server components), always import from the legacy build path to avoid browser API dependencies
- **Author:** AI

### Error: pdfjs-dist worker "No GlobalWorkerOptions.workerSrc specified" in server/test

- **Context:** `Setting up fake worker failed: "No GlobalWorkerOptions.workerSrc specified"` when using pdfjs-dist in Next.js API routes and Bun tests
- **Cause:** Setting `GlobalWorkerOptions.workerSrc = ""` doesn't actually disable the worker — pdfjs-dist still tries to create a fake worker via dynamic import, which fails in bundled environments
- **Fix:** Use `pathToFileURL(resolve(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")).href` to get an absolute file URL. `createRequire().resolve()` fails in Turbopack, `new URL(..., import.meta.url)` resolves relative to source file (not node_modules) in Bun tests, and `import.meta.resolve()` is unsupported in Turbopack
- **Lesson:** For pdfjs-dist server-side worker path resolution in Next.js 16 + Turbopack + Bun: use `pathToFileURL(resolve(process.cwd(), "node_modules/...")).href`. The `createRequire`, `import.meta.url`, and `import.meta.resolve` approaches all fail in at least one of the environments.
- **Author:** AI

### Error: Gemini text-embedding-004 deprecated, returns 404

- **Context:** `Error fetching from .../models/text-embedding-004: [404] models/text-embedding-004 is not found for API version v1beta` during embedding generation
- **Cause:** Google deprecated `text-embedding-004` and `embedding-001` models in February 2026, removing them from the v1beta API
- **Fix:** Switch to `gemini-embedding-001` model. Use raw REST API (`batchEmbedContents`) instead of SDK because `@google/generative-ai` v0.24.1 doesn't support `outputDimensionality` parameter needed to reduce dimensions from 3072 to 768
- **Lesson:** Always check Gemini model deprecation status. For embedding dimensionality reduction, use raw REST API when the SDK doesn't support the parameter. Model name: `gemini-embedding-001` (not `text-embedding-004`)
- **Author:** AI

## feat/005-file-management — 2026-07-14

### Error: Stale selectedFileIds after file deletion

- **Context:** When files are deleted via the sidebar, their IDs remain in the Zustand `selectedFileIds` store, causing stale selection state
- **Cause:** The `useDeleteFile` hook invalidates the `["files"]` query but doesn't clean up the `selectedFileIds` in the Zustand store. No `removeFiles` action existed on the store.
- **Fix:** Added `removeFiles(ids: string[])` action to the Zustand store, and called it from `useDeleteFile.onSuccess` to clean up deleted file IDs from selection
- **Lesson:** When implementing delete mutations that affect shared client state (Zustand stores, selected items, etc.), always clean up related state in the mutation's `onSuccess` callback. Query invalidation only refreshes server state — client-side state (Zustand, local state) must be cleaned up separately.
- **Author:** AI

### Error: No error feedback on failed delete mutation

- **Context:** If the delete mutation fails, the confirmation dialog stays open with no error feedback to the user
- **Cause:** `handleDelete` calls `mutateAsync` but doesn't catch errors, and there's no error state displayed in the dialog
- **Fix:** Wrapped `mutateAsync` in try/catch, showed error via sonner toast, and prevented dialog from closing on error
- **Lesson:** Always handle mutation errors with user-visible feedback (toast, inline error). Silent failures leave users confused about what happened.
- **Author:** AI

## feat/008-polish (embedding fix) — 2026-07-15

### Error: Gemini embedding quota exhausted (429) on large PDFs

- **Context:** Uploading a 95-page PDF (115 chunks) triggers `RESOURCE_EXHAUSTED` 429 error from Gemini embedding API
- **Cause:** `BATCH_SIZE=100` was too aggressive for the free tier — a single batch of 100 embedding requests exceeds the per-minute quota. No delay between batches compounds the issue.
- **Fix:** Reduced `BATCH_SIZE` from 100 → 20, added 1s delay between batches, increased `MAX_RETRIES` from 3 → 5, increased base retry delay from 1s → 5s (backoff: 5s/10s/20s/40s/80s)
- **Lesson:** Gemini free tier has strict per-minute and per-day embedding quotas. For large documents, use small batch sizes (20), add inter-batch delays, and use longer retry backoffs (5s base) to stay within limits. A 95-page PDF with 2000-char chunks produces ~115 chunks — that's 6 batches of 20 with 1s delays = ~6 seconds of embedding work.
- **Author:** AI

### Error: Gemini 1.5 Flash model deprecated, returns 404 on generateContent

- **Context:** `Error fetching from .../models/gemini-1.5-flash:streamGenerateContent?alt=sse: [404] models/gemini-1.5-flash is not found for API version v1beta` when calling chat API
- **Cause:** Google deprecated `gemini-1.5-flash` in the v1beta API, same pattern as the earlier `text-embedding-004` deprecation
- **Fix:** Switched to `gemini-3-flash-preview` (latest 3-series Flash model with free tier, 1M context)
- **Lesson:** Google regularly deprecates Gemini models. Always verify model availability before using. As of July 2026: chat model is `gemini-3-flash-preview`, embedding model is `gemini-embedding-001`. Check https://ai.google.dev/gemini-api/docs/models for current list.
- **Author:** AI
