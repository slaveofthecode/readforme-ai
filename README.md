# AI-Assisted Engineering Harness (Base Template)

This repository is equipped with a professional, platform-agnostic **AI Engineering Harness**. Instead of relying on passive AI chats, this project uses an automated context-engineering architecture that governs code quality, enforces architectural standards, and guides AI agents deterministically.

---

## 🛠️ Harness Architecture: How It Works

The harness is divided into five modular pillars located inside the root and the `.harness/` directory. Each component has a strict, unique responsibility:

### 1. Continuous Project State (`MEMORY.md`)

- **What it is:** The short and long-term memory of the repository.
- **How it's used:** Every time a new session starts, the AI indexes this file. It instantly learns the exact tech stack (Bun, React, Tailwind, Shadcn), the feature-driven directory structure, and the active roadmap. It prevents the AI from losing context during long development cycles.

### 2. Central Nervous System (`AGENT.md`)

- **What it is:** The Lead Architect and Main Orchestrator.
- **How it's used:** This is the entry point for all AI interactions (via Cursor or OpenCode CLI). You always talk to `AGENT.md`. It processes your request, checks the current project memory, adopts the required specialized mindset, and enforces quality constraints before writing code.

### 3. Execution Verification Protocols (`.harness/commands/`)

- **What they are:** The technical gatekeepers of code stability.
- **How they're used:** Individual files that define exactly when and how the AI must execute or suggest automated terminal scripts (`bun run lint`, `bun test`, `bun x tsc`). They act as verification checkpoints to ensure no broken or unformatted code gets injected into the codebase.

### 4. Quality Standards & Constraints (`.harness/skills/`)

- **What they are:** The philosophical guardrails of the codebase.
- **How they're used:** They define **how** code must be written based on senior engineering practices (e.g., Strict Type-Safety, Mobile-First responsive design, forbidden patterns like `any`). They shape the AI's behavior to prevent lazy shortcuts.

### 5. Atomic Specialized Sub-Agents (`.harness/agents/`)

- **What they are:** Hyper-focused contextual profiles.
- **How they're used:** Complex tasks are broken down into atomic steps. The orchestrator delegates responsibilities to specific sub-agents (`architect`, `ui-expert`, `frontend-logic`, `tester`). Isolating roles inside small markdown files optimizes the AI's context window and drastically reduces hallucinations.

---

## 🚀 Standard Workflow Lifecycle

```text
[User Request] ──> Read Implicitly ──> [AGENT.md] (Orchestrator)
                                            │
       ┌────────────────────────────────────┼────────────────────────────────────┐
       ▼                                    ▼                                    ▼
1. Sync State                        2. Delegate Task                     3. Apply Restrictions
[MEMORY.md]                          [.harness/agents/*]                  [.harness/skills/*]
Updates current goals                Invokes atomic expert                Enforces clean code
       │                                    │                                    │
       └────────────────────────────────────┼────────────────────────────────────┘
                                            ▼
                                 [Generate Clean Code]
                                            │
                                            ▼
                                  4. Verify Execution
                                  [.harness/commands/*]
                                  Runs linter, tsc, & tests
```

## 🗂️ Detailed Harness Reference

Here is the technical breakdown of every control script and rule-set governing this repository.

### 🎛️ Verification Protocols (`.harness/commands/`)

These are the technical checkpoints that both you (via `/` shortcuts) and the AI (via terminal execution) use to validate code before pushing to branches.

- **`lint.md` (Code Style & Formatting):**
  - **Purpose:** Ensures the codebase remains visually clean and matches formatting rules.
  - **Under the Hood:** Runs ESLint and Prettier via Bun using `bun run lint` or `bun run lint:fix`.
  - **When it triggers:** Every time UI components are modified or large refactors take place.
- **`type-check.md` (Strict Type Validation):**
  - **Purpose:** The ultimate guardian against type errors. It prevents compilation issues in production.
  - **Under the Hood:** Invokes the TypeScript compiler in verification mode using `bun x tsc --noEmit`.
  - **When it triggers:** Mandatory execution before any task is considered complete. If it outputs errors, they must be fixed instantly.
- **`test.md` (Unit Testing Execution):**
  - **Purpose:** Guarantees that business logic, custom hooks, and utilities work exactly as intended.
  - **Under the Hood:** Executes Bun's lightning-fast native test runner via `bun test`.
  - **When it triggers:** Runs whenever logic, calculations, data states, or service APIs are altered. A failing test completely blocks task delivery.

---

### 📜 Architectural Guardrails (`.harness/skills/`)

These are behavioral laws that shape the AI's intelligence. They don't run console commands; instead, they inject senior engineering constraints into the AI's mindset.

- **`atomic-ui.md` (UI Purity & Responsive Standards):**
  - **Purpose:** Enforces clean interfaces and a rigid user-experience approach.
  - **Rules:** Forces a strict **Mobile-First** coding flow using Tailwind CSS responsive prefixes (`md:`, `lg:`). It also mandates that all shared components remain pure (zero hardcoded business logic or API calls inside visual layers).
- **`clean-code.md` (Quality & Code Governance):**
  - **Purpose:** Prevents bad coding shortcuts and enforces industry standards.
  - **Rules:** Completely FORBIDS the use of `any` in TypeScript, enforces the Single Responsibility Principle (functions under 40 lines), requires strict error handling (`try/catch`), and explicitly bans empty placeholders or code stubs (`// TODO`).
