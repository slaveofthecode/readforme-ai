# COMMAND: TYPE CHECKING

## 1. Tooling & Ecosystem

- **Compiler:** TypeScript Compiler (`tsc`) executing natively inside Bun environment.

## 2. Terminal Command

- **Verification:** `bun x tsc --noEmit`

## 3. Protocol & Trigger Conditions

- **User Trigger:** Can be manually executed anytime inside the chat using the `/type-check` shortcut.
- **AI Trigger:** This protocol is MANDATORY. The AI is NOT allowed to consider a coding task complete until `bun x tsc --noEmit` has been executed and returns ZERO errors.
- **Error Handling:** If this command outputs compilation or type errors, the AI must automatically adopt the `@architect` or `@frontend-logic` mindset to resolve the type definitions immediately.
