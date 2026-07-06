# COMMAND: CODE LINTING & FORMATTING

## 1. Tooling & Ecosystem

- **Linter & Formatter:** ESLint + Prettier (executed via Bun)

## 2. Terminal Commands

- **Check only:** `bun run lint`
- **Auto-fix styles:** `bun run lint:fix` (or `bun x eslint --fix`)

## 3. Protocol & Trigger Conditions

- **User Trigger:** Can be manually executed anytime inside the chat using the `/lint` shortcut.
- **AI Trigger:** The AI MUST suggest or run `bun run lint:fix` right after creating or modifying any visual UI component or refactoring a file.
- **Expected Outcome:** The command must finish with exit code 0. If code styling errors appear in the terminal output, the AI must fix them before delivering the task.
