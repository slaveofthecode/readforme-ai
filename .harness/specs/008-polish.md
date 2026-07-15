---
status: in-progress
created: 2026-07-15
---

# Spec: feat/008-polish

## 1. Overview

Final polish pass across the entire application: error boundaries, consistent error feedback, performance optimization, and UX cleanup. This is the last feature before the app is considered complete.

## 2. Acceptance Criteria

- [ ] App-level error boundary catches rendering crashes with fallback UI
- [ ] File list shows error state instead of misleading empty state on fetch failure
- [ ] Upload validation errors use toast notifications instead of browser alerts
- [ ] ChatMessageItem is memoized to prevent unnecessary re-renders during streaming
- [ ] useChat mutation uses onSettled for guaranteed streaming cleanup
- [ ] Completed uploads auto-dismiss after 5 seconds
- [ ] All changes pass lint, typecheck, and tests

## 3. Architecture (Architect)

### Changes

| File                                                 | Change                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `src/app/error.tsx`                                  | New — Next.js App Router error boundary                            |
| `src/features/files/components/file-list.tsx`        | Add `isError` handling with retry button                           |
| `src/features/upload/components/file-upload.tsx`     | Replace `alert()` with `toast.error()`, auto-dismiss ready uploads |
| `src/features/chat/components/chat-message-item.tsx` | Wrap with `React.memo`                                             |
| `src/features/chat/hooks/use-chat.ts`                | Replace `onSuccess`/`onError` with `onSettled` for cleanup         |

### No new types or models needed

## 4. UI Design (UI Expert)

### Error Boundary Fallback

```
┌─────────────────────────────┐
│  ⚠️ Something went wrong    │
│                             │
│  [Try Again]                │
└─────────────────────────────┘
```

### File List Error State

```
┌─────────────────────────────┐
│  ⚠️ Failed to load files    │
│  [Try Again]                │
└─────────────────────────────┘
```

## 5. Implementation Notes

- Error boundary uses Next.js `error.tsx` convention (client component)
- File list destructures `isError` + `refetch` from useFileList()
- Toast uses existing sonner `toast.error()` pattern from delete-confirm-dialog
- `React.memo` with shallow comparison on message.id + message.content + message.role
- `onSettled` replaces both `onSuccess`/`onError` for setStreaming(false)
- Auto-dismiss: `useEffect` in FileUpload removes "ready" uploads after 5s delay

## 6. Verification

```bash
bun run lint
bun x tsc --noEmit
bun test
```
