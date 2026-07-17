---
status: draft
created: 2026-07-17
---

# Spec: feat/009-ui-improvements

## 1. Overview

A collection of UI/UX improvements and backend cleanup for v1.0.0. Includes sidebar width increase, removal of dead `filePath` column, BookOpen favicon, bulk file deletion with confirmation, and removal of redundant "Ready" badge.

## 2. Acceptance Criteria

- [ ] Sidebar width increased by 30% (256px → 336px)
- [ ] `filePath` column removed from `files` table via Prisma migration
- [ ] All references to `filePath` cleaned up (API routes, cleanup logic, tests)
- [ ] Favicon displays the BookOpen icon in the browser tab
- [ ] When one or more files are selected, a Trash2 icon appears in the file list header
- [ ] Clicking the Trash2 icon opens a confirmation dialog listing selected files
- [ ] Confirming deletion removes all selected files via batch API endpoint
- [ ] "Ready" badge no longer renders for files with status `ready`
- [ ] All verification commands pass: lint, typecheck, tests

## 3. Architecture (Architect)

### Types & Interfaces

```typescript
// Batch delete request
interface BatchDeleteRequest {
  fileIds: string[];
}

// Batch delete response
interface BatchDeleteResponse {
  deleted: number;
}
```

### Data Models

```prisma
// Remove filePath from File model
model File {
  id           String      @id @default(uuid())
  name         String
  size         Int
  status       FileStatus  @default(uploading)
  pageCount    Int?
  // filePath removed — files are processed in-memory only
  errorMessage String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  deletedAt    DateTime?

  chunks       Chunk[]
  chatMessages ChatMessage[]

  @@index([status])
  @@index([createdAt])
  @@map("files")
}
```

### File Structure

```
src/
├── app/
│   ├── api/files/batch-delete/route.ts   # NEW: batch delete endpoint
│   ├── icon.tsx                           # NEW: BookOpen favicon
│   └── page.tsx                           # MODIFIED: sidebar width w-84
├── features/files/
│   ├── components/
│   │   ├── file-list.tsx                  # MODIFIED: bulk delete icon
│   │   ├── file-list-item.tsx             # MODIFIED: remove Ready badge
│   │   └── delete-confirm-dialog.tsx      # MODIFIED: support multi-delete
│   └── hooks/
│       └── use-file-list.ts              # unchanged
├── features/upload/
│   └── hooks/
│       └── use-file-upload.ts            # MODIFIED: add useDeleteMultipleFiles
└── lib/
    ├── file-cleanup.ts                   # MODIFIED: remove filePath logic
    └── upload-processor.test.ts          # MODIFIED: remove filePath mock
```

## 4. UI Design (UI Expert)

### Sidebar (modified)

```
┌──────────────────────────────────────┐
│ 📖 ReadForMe AI                      │  ← BookOpen icon (unchanged)
├──────────────────────────────────────┤
│ [File Upload Drop Zone]              │
├──────────────────────────────────────┤
│ ☑ File A.pdf          1.2MB  error  │
│ ☑ File B.pdf          2.4MB         │  ← No "Ready" badge
│ ☐ File C.pdf          3.1MB  error  │
│──────────────────────────────────────│
│                         🗑️           │  ← Trash2 icon (appears when selected)
├──────────────────────────────────────┤
│ v1.0.0                               │
└──────────────────────────────────────┘
        ↑ w-84 (336px)
```

### Delete Confirmation Dialog (modified)

```
┌──────────────────────────────────────┐
│  Delete 2 files?                     │
│                                      │
│  Are you sure you want to delete     │
│  these files? This action cannot     │
│  be undone.                          │
│                                      │
│  • File A.pdf                        │
│  • File B.pdf                        │
│                                      │
│         [Cancel]    [Delete]         │
└──────────────────────────────────────┘
```

## 5. Implementation Notes

- Sidebar width: change `w-64` to `w-84` in `page.tsx` line 27
- `filePath` removal requires a Prisma migration — never edit migration files manually
- Favicon: use `src/app/icon.tsx` (Next.js App Router convention) rendering lucide-react `BookOpen` as SVG
- Bulk delete endpoint: `POST /api/files/batch-delete` accepting `{ fileIds: string[] }`, performing soft-delete on each
- The Trash2 icon should only appear when at least one file is selected
- Remove the `ready` case from `STATUS_CONFIG` in `file-list-item.tsx` — files with `ready` status render no badge
- The existing `useDeleteFile` hook handles single deletion; create `useDeleteMultipleFiles` for batch operations

## 6. Verification

```bash
bunx prisma migrate dev --name remove_file_path_column
bunx prisma generate
bun run lint
bun x tsc --noEmit
bun test
```
