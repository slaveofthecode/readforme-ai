# SKILL: ZUSTAND STATE MANAGEMENT

## 1. Store Structure

- Define stores using the `create` function from `zustand`.
- Use the slices pattern for stores with multiple concerns: split state and actions into logical groups and compose them into a single store.
- Each store file must export a typed hook: `export const useStoreName = create<StoreType>()(...)`.

## 2. State Separation

- Zustand is for **UI/Client state only**: selected files, sidebar open/close, chat messages, form state.
- **Server state** (file list, query results) belongs to TanStack Query, not Zustand.
- Never store server-fetched data in Zustand.

## 3. Persistence

- Use `persist` middleware from `zustand/middleware` for state that must survive page reloads (e.g., selected file IDs, theme preference).
- Use `partialize` to whitelist only the fields that need persistence.

## 4. Testing

- Extract store logic into pure reducer-like functions when possible.
- Test stores by calling actions and asserting state changes.
- Use `bun:test` with `describe`, `test`, `expect`.

## 5. TypeScript

- Always type the store interface explicitly.
- Use `immer` middleware if dealing with nested state to simplify immutable updates.
- Actions must be typed as methods on the store interface.
