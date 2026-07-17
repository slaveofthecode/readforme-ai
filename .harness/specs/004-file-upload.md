---
status: completed
created: 2026-07-14
---

# Spec: feat/004-file-upload

## 1. Overview

Implement PDF file upload with async processing pipeline: text extraction, chunking, embedding generation with Gemini, and storage in pgvector. Files auto-expire after configurable TTL (default 24h).

## 2. Acceptance Criteria

- [x] Drag-and-drop upload UI accepts only PDF files
- [x] Client-side validation (type, size max 10MB)
- [x] Upload progress indicator
- [x] API route POST /api/upload creates File record and starts processing
- [x] PDF text extraction with pdfjs-dist preserving page numbers
- [x] Text chunking with overlap (2000 chars, 15% overlap)
- [x] Embedding generation via Gemini text-embedding-004 (768 dimensions)
- [x] Chunks with embeddings stored in pgvector
- [x] File status transitions: uploading -> processing -> ready / error
- [x] Async processing (non-blocking API response)
- [x] DELETE /api/files/[fileId] removes file and DB records
- [x] Auto-cleanup of expired files based on FILE_TTL_HOURS
- [x] UI shows expiration info for each file
- [x] All UI text in English
- [x] Lint passes: bun run lint
- [x] Type check passes: bun x tsc --noEmit

## 3. Architecture

### Data Flow

```
Client -> POST /api/upload (PDF file)
  -> Create File record (status: processing)
  -> Pass buffer in memory to processUpload (no disk writes — Vercel compatible)
  -> Return file ID immediately
  -> Background: extract -> chunk -> embed -> store
  -> Update status to ready / error

Client -> polls GET /api/files/[fileId] for status
Client -> DELETE /api/files/[fileId] to remove
```

### File Structure

```
src/
├── app/api/
│   ├── upload/route.ts              # POST - Upload PDF
│   └── files/[fileId]/route.ts      # DELETE - Remove file
├── features/upload/
│   ├── components/file-upload.tsx   # Drag-and-drop UI
│   └── hooks/use-file-upload.ts     # Upload mutation hook
├── features/files/
│   └── components/file-list-item.tsx # File item with expiration
├── lib/
│   ├── pdf.ts                       # PDF text extraction
│   ├── chunker.ts                   # Text chunking
│   ├── embedding.ts                 # Gemini embeddings
│   ├── upload-processor.ts          # Pipeline orchestrator
│   └── file-cleanup.ts              # Auto-cleanup utility
prisma/
├── migrations/
│   └── YYYYMMDD_add_file_path/      # Add filePath field
```

### Types

```typescript
interface ExtractedPage {
  pageNumber: number;
  text: string;
}

interface ExtractedPDF {
  pages: ExtractedPage[];
  metadata: { pageCount: number };
}

interface Chunk {
  text: string;
  pageNumber: number;
  chunkIndex: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
```

### Environment Variables

```env
FILE_TTL_HOURS=24  # Hours before auto-deletion (configurable)
```

## 4. Implementation Notes

1. **PDF Processing**: Use pdfjs-dist for server-side text extraction
2. **Chunking**: Fixed-size chunks (2000 chars) with 15% overlap (300 chars)
3. **Embeddings**: Gemini text-embedding-004, batch max 100 texts
4. **Rate Limits**: 30 req/min free tier, exponential backoff on 429
5. **File Storage**: In-memory buffer passed to processor — no disk writes (Vercel serverless compatible)
6. **Cleanup**: Run hourly interval to delete expired files

## 5. Verification

```bash
bun run lint                    # Code style
bun x tsc --noEmit              # Type safety
DATABASE_URL="..." bunx prisma migrate dev --name add-file-path
DATABASE_URL="..." bunx prisma generate
```

## 6. Dependencies

- feat/002-layout-providers (Providers wrapper)
- feat/003-database-schema (File, Chunk models)
- pdfjs-dist (already installed)
- @google/generative-ai (already installed)
