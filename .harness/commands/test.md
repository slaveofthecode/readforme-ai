# COMMAND: TEST EXECUTION

## 1. Tooling & Ecosystem

- **Test Runner:** Native Bun Test framework (`bun:test`)
- **Environment:** Built-in TypeScript and JSX support with zero-config transpilations.

## 2. Terminal Commands

- **Run all tests:** `bun test`
- **Run in watch mode:** `bun test --watch`
- **Run specific file:** `bun test ./src/features/auth/auth.test.ts`

## 3. Protocol & Trigger Conditions

- **User Trigger:** Can be manually executed anytime inside the chat using the `/test` shortcut.
- **AI Trigger:** The AI MUST run or suggest running `bun test` whenever business logic, custom hooks, utilities, or state structures are created, modified, or refactored.
- **Failure Protocol:** If any test fails, the AI is FORBIDDEN to deliver the task. It must analyze the test failure output, locate the bug in the source code, apply the fix, and re-run the tests until all test suites pass successfully (Exit Code 0).
