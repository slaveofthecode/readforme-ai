# PROJECT MEMORY

## 1. Tech Stack & Environment

- **Framework:** Next.js (App Router)
- **Runtime & Package Manager:** Bun
- **Language:** TypeScript (Strict Mode)
- **Frontend:** React
- **Styling:** Tailwind CSS
- **UI Component Library:** Shadcn/ui
- **State Management:** Zustand (UI state)
- **Data Fetching:** TanStack Query (server state)
- **ORM:** Prisma
- **Database:** PostgreSQL + pgvector (vector embeddings)
- **LLM Provider:** Google Gemini (free tier)
- **API Layer:** Next.js API Routes (REST)
- **Testing Framework:** Bun Test (`bun test` native runner)
- **Linting:** ESLint + Prettier
- **Environment:** Modern Web Ecosystem with strict Mobile-First Responsive Design

## 2. Repository & Architecture Standards

### Naming Conventions

- **Directories/Folders:** `kebab-case` (e.g., `components/auth-form/`)
- **React Components:** `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- **Hooks/Utilities/Files:** `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`)
- **Styles/Assets:** `kebab-case` (e.g., `main-logo.png`)

### Git Branching Strategy (Feature-Driven)

- `main` -> Production ready, stable code. No direct commits allowed.
- `development` -> Integration branch for features.
- `feat/[feature-name]` -> Atomic feature branches (e.g., `feat/login-validation`).
- `bug/[bug-name]` -> Hotfixes or bug resolutions.

## 3. Directory Structure Map (Feature-Driven Template)

```text
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/             # Shared global UI components (Shadcn/ui)
├── features/               # Modular domain-driven features
│   └── [feature-name]/
│       ├── components/     # Components exclusive to this feature
│       ├── hooks/          # Zustand stores + TanStack Query hooks
│       └── services/       # API calls
├── stores/                 # Global Zustand stores
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── pdf.ts              # PDF parsing utilities
│   ├── embeddings.ts       # Embedding generation (Gemini)
│   └── gemini.ts           # Gemini SDK client
└── utils/                  # Global pure utility functions
```

## 4. Active Tasks & Progress

### Harness Foundation

- [x] Create core structure and directory layout (`.harness/`)
- [x] Configure global state management contract (`MEMORY.md`)
- [x] Program the central nervous system (`AGENTS.md`)
- [x] Configure execution verification protocols (`.harness/commands/`)
- [x] Establish coding quality standards and constraints (`.harness/skills/`)
- [x] Define atomic sub-agent behavior profiles (`.harness/agents/`)

### Harness Entry Points (Tool-Agnostic)

- [x] Create main orchestrator (`AGENTS.md`) — tool-agnostic system prompt
- [x] Configure Cursor entry point (`.cursorrules`) — references AGENTS.md + .harness/
- [x] Create Claude Code entry point (`CLAUDE.md`) — references AGENTS.md + .harness/
- [x] Create OpenCode entry point (`opencode.json`) — references AGENTS.md + .harness/ via instructions

### Stack Completion

- [x] Add Zustand skill (`zustand.md`)
- [x] Add TanStack Query skill (`tanstack-query.md`)
- [x] Add Shadcn/ui skill (`shadcn-ui.md`)
- [x] Add Prisma skill (`prisma.md`)
- [x] Add file upload skill (`file-upload.md`)
- [x] Add PDF processing skill (`pdf-processing.md`)
- [x] Add vector search skill (`vector-search.md`)
- [x] Add RAG pipeline skill (`rag-pipeline.md`)
- [x] Add LLM integration skill (`llm-integration.md`)
- [x] Add AI Engineer sub-agent (`ai-engineer.md`)
- [x] Add database command (`db.md`)
