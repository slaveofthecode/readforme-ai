---
status: completed
created: 2026-07-14
---

# Spec: feat/005-file-management

## 1. Overview

Build a file management system that allows users to list, view status, select, and delete uploaded PDF files. Selected files provide context for the RAG chat pipeline (feat/007). Files are displayed in the sidebar below the upload zone.

## 2. Acceptance Criteria

- [ ] GET /api/files returns all non-deleted files sorted by createdAt desc
- [ ] File list displays in sidebar with name, size, status badge, checkbox, and delete action
- [ ] Multi-select checkboxes for choosing files for RAG context
- [ ] Selected file count visible in sidebar
- [ ] Delete confirmation dialog before file removal
- [ ] Empty state message when no files exist
- [ ] Loading skeleton during file list fetch
- [ ] Zustand store for selected file IDs with persist middleware
- [ ] TanStack Query for file list fetching with cache invalidation on delete
- [ ] formatFileSize utility for human-readable sizes
- [ ] All UI text in English
- [ ] Lint passes: bun run lint
- [ ] Type check passes: bun x tsc --noEmit
- [ ] Tests pass: bun test

## 3. Architecture

### Types & Interfaces

```typescript
interface FileListItem {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error";
  pageCount: number | null;
  errorMessage: string | null;
  createdAt: string;
}

interface FileListResponse {
  files: FileListItem[];
}

interface FileSelectionState {
  selectedFileIds: string[];
  toggleFile: (id: string) => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
}
```

### Data Models

No schema changes required. Uses existing File model with `deletedAt` soft delete.

### File Structure

```
src/
├── app/api/
│   └── files/
│       └── route.ts                    # GET - List files
├── features/files/
│   ├── components/
│   │   ├── file-list.tsx               # Main list container
│   │   ├── file-list-item.tsx          # Individual file row
│   │   ├── empty-file-list.tsx         # Empty state
│   │   └── delete-confirm-dialog.tsx   # Delete confirmation
│   └── hooks/
│       └── use-file-list.ts            # TanStack Query hook
├── stores/
│   └── file-selection.ts              # Zustand selection store
└── lib/
    └── format.ts                       # formatFileSize utility
```

## 4. UI Design

### Sidebar Layout

```
┌─────────────────────────────┐
│  ReadForMe AI               │
├─────────────────────────────┤
│  [Upload Zone]              │
│  (existing feat/004)        │
├─────────────────────────────┤
│  Files (3 selected)         │
│  ┌───────────────────────┐  │
│  │ [x] report.pdf   >   │  │
│  │ [x] slides.pdf   >   │  │
│  │ [ ] notes.pdf    >   │  │
│  │ [ ] broken.pdf   >   │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  v1.0.0                     │
└─────────────────────────────┘

Status indicators: > = ready, ... = processing, ! = error
```

### Components

- **FileList**: Scrollable container, shows file count, select all checkbox
- **FileListItem**: Checkbox, filename (truncated), status badge, dropdown with delete
- **EmptyFileList**: "No files uploaded yet" with icon
- **DeleteConfirmDialog**: "Are you sure?" dialog with file name

## 5. Implementation Notes

1. **GET /api/files**: Query `File` where `deletedAt IS NULL`, order by `createdAt desc`
2. **Zustand Store**: Use `persist` middleware with `partialize` to only persist `selectedFileIds`
3. **Cache Invalidation**: `useDeleteFile` already invalidates `["files"]` query key
4. **Status Badge**: Use shadcn `Badge` with variant based on status
5. **File Size**: Convert bytes to KB/MB/GB with `formatFileSize` utility
6. **Scrollable List**: Use shadcn `ScrollArea` with max-height constraint

## 6. Verification

```bash
bun run format
bun run lint
bun x tsc --noEmit
bun test
```

## 7. Dependencies

- feat/004-file-upload (file upload and processing)
- feat/002-layout-providers (Providers wrapper, shadcn)
- feat/003-database-schema (File model)
