# AI-Assisted Engineering Harness (Base Template)

This repository is equipped with a professional, platform-agnostic **AI Engineering Harness**. Instead of relying on passive AI chats, this project uses an automated context-engineering architecture that governs code quality, enforces architectural standards, and guides AI agents deterministically.

The harness is designed to be **tool-agnostic** — it works identically across Cursor, OpenCode, Claude Code, Copilot, or any other AI coding assistant.

---

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Runtime** | Bun |
| **Language** | TypeScript (Strict Mode) |
| **Frontend** | React |
| **Styling** | Tailwind CSS |
| **UI Components** | Shadcn/ui |
| **State Management** | Zustand (UI state) |
| **Data Fetching** | TanStack Query (server state) |
| **ORM** | Prisma |
| **Database** | PostgreSQL + pgvector |
| **LLM** | Google Gemini (free tier) |
| **API Layer** | Next.js API Routes (REST) |
| **Testing** | Bun Test (`bun:test`) |
| **Linting** | ESLint + Prettier |

---

## Entry Points by AI Tool

Each AI tool requires a specific file or configuration to discover this harness. All of them reference the same canonical source of truth (`.harness/`), ensuring identical behavior regardless of which tool you use.

### OpenCode

- **Config file:** `opencode.json`
- **Rules file:** `AGENTS.md`
- **How it works:** OpenCode loads `AGENTS.md` as project rules automatically. The `opencode.json` includes all `.harness/` files via the `instructions` property, giving the agent full access to the harness.

### Cursor

- **Config file:** `.cursorrules`
- **How it works:** Cursor reads `.cursorrules` automatically on startup. This file instructs it to read `AGENTS.md` and the entire `.harness/` directory to apply governance rules.

### Claude Code (Anthropic)

- **Config file:** `CLAUDE.md`
- **How it works:** Claude Code detects `CLAUDE.md` at the project root and uses it as a system prompt. This file instructs it to read `AGENTS.md` and `.harness/` to follow the same protocol as other tools.

### Any other tool

- **Config file:** `AGENTS.md`
- **How it works:** `AGENTS.md` is plain markdown with no tool-specific dependencies. Simply configure your AI tool to read it as the initial instruction set.

---

## Harness Architecture: How It Works

The harness is divided into five modular pillars located inside the root and the `.harness/` directory. Each component has a strict, unique responsibility:

### 1. Continuous Project State (`MEMORY.md`)

- **What it is:** The short and long-term memory of the repository.
- **How it's used:** Every time a new session starts, the AI indexes this file. It instantly learns the exact tech stack, the feature-driven directory structure, and the active roadmap. It prevents the AI from losing context during long development cycles.

### 2. Central Nervous System (`AGENTS.md`)

- **What it is:** The Lead Architect and Main Orchestrator.
- **How it's used:** This is the entry point for all AI interactions. You always talk to `AGENTS.md`. It processes your request, checks the current project memory, adopts the required specialized mindset, and enforces quality constraints before writing code.

### 3. Execution Verification Protocols (`.harness/commands/`)

- **What they are:** The technical gatekeepers of code stability.
- **How they're used:** Individual files that define exactly when and how the AI must execute or suggest automated terminal scripts (`bun run lint`, `bun test`, `bun x tsc`). They act as verification checkpoints to ensure no broken or unformatted code gets injected into the codebase.

### 4. Quality Standards & Constraints (`.harness/skills/`)

- **What they are:** The philosophical guardrails of the codebase.
- **How they're used:** They define **how** code must be written based on senior engineering practices (e.g., Strict Type-Safety, Mobile-First responsive design, forbidden patterns like `any`). They shape the AI's behavior to prevent lazy shortcuts.

### 5. Atomic Specialized Sub-Agents (`.harness/agents/`)

- **What they are:** Hyper-focused contextual profiles.
- **How they're used:** Complex tasks are broken down into atomic steps. The orchestrator delegates responsibilities to specific sub-agents (`architect`, `ui-expert`, `frontend`, `backend`, `tester`, `ai-engineer`). Isolating roles inside small markdown files optimizes the AI's context window and drastically reduces hallucinations.

---

## Standard Workflow Lifecycle

```text
[User Request] ---> Read Implicitly ---> [AGENTS.md] (Orchestrator)
                                              │
       ┌──────────────────────────────────────┼──────────────────────────────────────┐
       ▼                                      ▼                                      ▼
1. Sync State                          2. Delegate Task                       3. Apply Restrictions
[MEMORY.md]                            [.harness/agents/*]                    [.harness/skills/*]
Updates current goals                  Invokes atomic expert                  Enforces quality rules
       │                                      │                                      │
       └──────────────────────────────────────┼──────────────────────────────────────┘
                                              ▼
                                   [Generate Clean Code]
                                              │
                                              ▼
                                    4. Verify Execution
                                    [.harness/commands/*]
                                    Runs linter, tsc, tests, db checks
```

---

## Detailed Harness Reference

### Verification Protocols (`.harness/commands/`)

These are the technical checkpoints that both you (via shortcuts) and the AI (via terminal execution) use to validate code before pushing to branches.

- **`lint.md` (Code Style & Formatting):**
  - **Purpose:** Ensures the codebase remains visually clean and matches formatting rules.
  - **Under the Hood:** Runs ESLint and Prettier via Bun using `bun run lint` or `bun run lint:fix`.
  - **When it triggers:** Every time UI components are modified or large refactors take place.
- **`type-check.md` (Strict Type Validation):**
  - **Purpose:** The ultimate guardian against type errors. It prevents compilation issues in production.
  - **Under the Hood:** Invokes the TypeScript compiler in verification mode using `bun x tsc --noEmit`.
  - **When it triggers:** Mandatory execution before any task is considered complete.
- **`test.md` (Unit Testing Execution):**
  - **Purpose:** Guarantees that business logic, custom hooks, and utilities work exactly as intended.
  - **Under the Hood:** Executes Bun's native test runner via `bun test`.
  - **When it triggers:** Runs whenever logic, calculations, data states, or service APIs are altered. A failing test completely blocks task delivery.
- **`db.md` (Database Operations):**
  - **Purpose:** Manages Prisma schema changes, migrations, and client generation.
  - **Under the Hood:** Executes `bunx prisma migrate dev`, `bunx prisma generate`.
  - **When it triggers:** After any modification to the Prisma schema.

---

### Architectural Guardrails (`.harness/skills/`)

These are behavioral laws that shape the AI's intelligence. They don't run console commands; instead, they inject senior engineering constraints into the AI's mindset.

#### Core (always active)

- **`clean-code.md` (Type Safety & Code Quality):**
  - **Rules:** Completely FORBIDS `any`, enforces Single Responsibility Principle (functions under 40 lines), requires strict `try/catch` error handling, bans code stubs.
- **`atomic-ui.md` (UI Purity & Responsive Standards):**
  - **Rules:** Forces strict **Mobile-First** coding with Tailwind responsive prefixes (`md:`, `lg:`). Shared components must remain pure (no business logic or API calls).

#### Domain-specific (load on demand)

- **`shadcn-ui.md`:** Component installation, theme customization, `cn()` utility usage, composition patterns.
- **`zustand.md`:** Store structure, slices pattern, persist middleware, store testing.
- **`tanstack-query.md`:** Queries, mutations, cache invalidation, loading/error/empty states, infinite queries.
- **`prisma.md`:** Schema design, migrations, soft delete, indexing, connection pooling, pgvector setup.
- **`file-upload.md`:** Drag-and-drop handling, file validation, Next.js route handler uploads, storage management.
- **`pdf-processing.md`:** PDF parsing, text extraction, chunking strategies (size, overlap).
- **`vector-search.md`:** pgvector setup, embedding generation (Gemini), similarity search, HNSW indexing.
- **`rag-pipeline.md`:** Full RAG workflow: ingest -> chunk -> embed -> store -> retrieve -> generate.
- **`llm-integration.md`:** Google Gemini SDK, prompt engineering, streaming responses, rate limits, free tier management.

---

### Sub-Agent Profiles (`.harness/agents/`)

| Agent | Responsibility |
|---|---|
| **architect** | Types, interfaces, file tree proposals, data contracts, Prisma schema design |
| **ui-expert** | Tailwind layouts, semantic HTML, a11y, Shadcn/ui components |
| **frontend** | Zustand stores, TanStack Query hooks, side-effects, Next.js pages |
| **backend** | Next.js API Routes, Prisma queries, file handling, LLM integration |
| **tester** | Unit tests with `bun:test`, integration tests, test coverage |
| **ai-engineer** | RAG pipeline, embedding strategy, prompt engineering, Gemini integration |

---

## Architecture & Conventions

### Directory Structure

```text
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/             # Shared global UI components (Shadcn/ui)
├── features/
│   └── [feature-name]/
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Zustand stores + TanStack Query hooks
│       └── services/       # API calls
├── stores/                 # Global Zustand stores
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── pdf.ts              # PDF parsing utilities
│   ├── embeddings.ts       # Embedding generation
│   └── gemini.ts           # Gemini SDK client
└── utils/                  # Pure utility functions
```

### Naming Conventions

- **Directories:** `kebab-case`
- **React Components:** `PascalCase.tsx`
- **Hooks/Utilities:** `camelCase.ts`
- **Styles/Assets:** `kebab-case`

### Git Branching

- `main` — Production ready, no direct commits
- `development` — Integration branch
- `feat/[feature-name]` — Feature branches
- `bug/[bug-name]` — Hotfixes
