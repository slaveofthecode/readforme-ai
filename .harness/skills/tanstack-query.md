# SKILL: TANSTACK QUERY DATA FETCHING

## 1. Queries

- Use `useQuery` for read operations (list files, get file metadata, search results).
- Define query keys as structured arrays: `['files'], ['files', fileId], ['search', queryText]`.
- Set appropriate `staleTime` and `gcTime` based on data freshness requirements.
- Extract query hooks into custom hooks: `useFiles()`, `useFile(id)`.

## 2. Mutations

- Use `useMutation` for write operations (upload file, delete file, send chat message).
- Invalidate related queries on mutation success via `queryClient.invalidateQueries()`.
- Handle `onMutate`, `onSuccess`, `onError`, `onSettled` callbacks for optimistic updates when appropriate.

## 3. Loading & Error States

- Every query must handle three states: `isLoading`, `error`, `data`.
- Return meaningful error messages from API routes so TanStack Query can display them.
- Use `isFetching` (background refetch) vs `isLoading` (no data yet) appropriately.

## 4. Infinite Queries

- For paginated lists (e.g., chat history, file list), use `useInfiniteQuery`.
- Implement cursor-based pagination in the API route.

## 5. Prefetching

- Use `queryClient.prefetchQuery()` in server components or route loaders for data the user will likely need.
- Use `queryClient.setQueryData()` for optimistic updates after mutations.
