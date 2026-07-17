# AI-Assisted Engineering Harness

This repository is equipped with a professional, platform-agnostic **AI Engineering Harness**. Instead of relying on passive AI chats, this project uses an automated context-engineering architecture that governs code quality, enforces architectural standards, and guides AI agents deterministically.

The harness is designed to be **tool-agnostic** — it works identically across Cursor, OpenCode, Claude Code, Copilot, or any other AI coding assistant.

---

## Methodology

This project follows a combination of **SDD (Specification-Driven Development)** and **TDD (Test-Driven Development)**, enforced by the AI harness through sub-agents and verification commands.

### SDD — Specification-Driven Development

**What it is:** Before writing any implementation code, you must first define the specifications: TypeScript types, interfaces, data contracts, and file structures.

**How it's implemented:**

1. The **architect** sub-agent is invoked first for any new feature or bug fix
2. The architect defines:
   - TypeScript interfaces and types (no `any` allowed)
   - Data models and database schemas (tables, relations, indexes)
   - File tree proposals (where new files go)
   - API contract definitions (request/response shapes)
3. Only AFTER the specifications are defined, the implementation agents (`frontend`, `backend`, `ui-expert`) begin coding
4. All code must strictly adhere to the defined specifications

**Example workflow:**

```text
User: "Add file upload feature"
  → Architect defines: UploadFile type, FileChunk interface, Database schema
  → Backend implements API route following the contract
  → Frontend implements hooks following the type definitions
  → Tester writes tests against the specifications
```

### TDD — Test-Driven Development

**What it is:** Tests are written to verify business logic, custom hooks, utilities, and API endpoints. A failing test blocks task delivery.

**How it's implemented:**

1. The **tester** sub-agent writes unit tests using the project's native test framework
2. Tests cover:
   - Happy path (expected behavior)
   - Edge cases (empty states, null values, incorrect inputs)
   - Error handling (network failures, validation errors)
3. Tests are executed via the project's test command before any task is considered complete
4. If any test fails, the AI MUST fix the issue and re-run until all tests pass

**Verification commands:**

```bash
# Execute the project's test runner (e.g., bun test, npm test, pytest)
<test command>
```

### Clean Code + SRP

**What it is:** All code must follow Single Responsibility Principle and clean code practices.

**Rules enforced:**

- No `any` type — use `unknown`, generics, or explicit unions
- Functions must not exceed 40 lines — break into sub-utilities
- All async operations wrapped in `try/catch` with error handling
- No code stubs, placeholders, or `// TODO` comments
- Components must be pure (no business logic in UI components)

---

## Workflow: How to Start a Feature

### Step 1: Identify the next feature

Check `MEMORY.md` section "Active Tasks & Progress" to see what's pending.

### Step 2: Create a branch from staging

```bash
git checkout staging
git pull origin staging
git checkout -b feat/XXX-description
```

Where `XXX` is the next correlating number (e.g., `feat/002-file-upload`).

### Step 3: Sync project state

The AI reads `MEMORY.md` to understand current goals and `registry.md` to learn from past patterns.

### Step 4: Specify (SDD)

The architect sub-agent defines types, interfaces, and data contracts.

### Step 5: Implement

The appropriate sub-agents (`frontend`, `backend`, `ui-expert`) implement the code following the specifications.

### Step 6: Verify (TDD + Quality)

Run verification commands:

```bash
<lint command>       # Check code style (e.g., eslint, ruff)
<typecheck command>  # Check type safety (e.g., tsc)
<test command>       # Run unit tests
```

### Step 7: Register

Update `.harness/registry.md` with:

- Feature ID, name, branch, status
- Patterns learned (what worked, what didn't)
- Architecture decisions made
- Any blockers resolved

### Step 8: Create PR

```bash
/pr
```

Or manually:

```bash
git add . && git commit -m "feat: description"
git push origin feat/XXX-description
```

---

## Workflow: How to Register a Bug

### Step 1: Create a bug branch from staging

```bash
git checkout staging
git pull origin staging
git checkout -b bug/XXX-description
```

Where `XXX` is the next correlating number (e.g., `bug/001-doc-issues`).

### Step 2: Identify the root cause

Analyze the bug and document:

- What happened (symptoms)
- Why it happened (root cause)
- Where it happened (file, line, context)

### Step 3: Fix and verify

Apply the fix and run all verification commands:

```bash
<lint command>
<typecheck command>
<test command>
```

### Step 4: Register in registry.md

Update `.harness/registry.md` with:

- Bug ID, name, branch, status
- Root cause analysis
- Fix applied
- Lesson learned (what the AI must do to avoid this in the future)

### Step 5: Create PR

```bash
/pr
```

---

## Branch Naming Convention

All branches MUST originate from `staging`. The naming format is:

```
type/XXX-description
```

Where:

- **type:** `feat` for features, `bug` for bug fixes
- **XXX:** Three-digit correlating number (001, 002, 003...)
- **description:** Kebab-case short description

**Examples:**

```bash
feat/001-scaffolding      # First feature: project scaffolding
feat/002-file-upload      # Second feature: file upload
feat/003-chat-ui          # Third feature: chat interface
bug/001-doc-issues        # First bug fix: documentation issues
bug/002-branch-naming     # Second bug fix: branch naming inconsistency
```

**Rules:**

- Always start from `staging`
- Numbers are global (features and bugs share the same sequence)
- Descriptions must be concise and descriptive
- No direct commits to `staging`

---

## Harness Architecture

The harness is divided into seven modular pillars:

### 1. Continuous Project State (`MEMORY.md`)

- Short and long-term memory of the repository
- AI reads this at session start to understand tech stack, goals, and progress

### 2. Central Nervous System (`AGENTS.md`)

- Lead Architect and Main Orchestrator
- Entry point for all AI interactions
- Processes requests, checks memory, delegates to sub-agents

### 3. Execution Verification Protocols (`.harness/commands/`)

- Technical gatekeepers for code stability
- Define when and how to run verification scripts
- Commands: `git.md`, `lint.md`, `type-check.md`, `test.md`, `db.md`, `pr.md`

### 4. Quality Standards & Constraints (`.harness/skills/`)

- Philosophical guardrails for the codebase
- Define HOW code must be written (Mobile-First, Type-Safety, SRP)
- Contains modular skill files outlining patterns for state, UI, database, etc.

### 5. Atomic Specialized Sub-Agents (`.harness/agents/`)

- Hyper-focused contextual profiles
- Complex tasks broken into atomic steps
- Profiles: `architect`, `ui-expert`, `frontend`, `backend`, `tester`, `ai-engineer`

### 6. AI Learning Memory (`.harness/registry.md`)

- Accumulated knowledge from past features and bugs
- Patterns learned, anti-patterns to avoid
- Architecture decisions and rationale
- Environment-specific findings

### 7. Feature Specifications (`.harness/specs/`)

- Versioned specification files for each feature
- Structure: `.harness/specs/<version>/<feature-id>-<feature-name>.md`
- `TEMPLATE.md` at root defines the spec format
- Example: `.harness/specs/v1.0.0/009-new-feature.md`
- When creating a new spec, ALWAYS use the current version folder

---

## Entry Points by AI Tool

| Tool            | Config File                   | How It Works                                                  |
| --------------- | ----------------------------- | ------------------------------------------------------------- |
| **OpenCode**    | `opencode.json` + `AGENTS.md` | Loads AGENTS.md as rules, includes .harness/ via instructions |
| **Cursor**      | `.cursorrules`                | Reads .cursorrules on startup, references AGENTS.md           |
| **Claude Code** | `CLAUDE.md`                   | Detects CLAUDE.md at root, uses as system prompt              |
| **Any other**   | `AGENTS.md`                   | Configure tool to read AGENTS.md as initial instructions      |

---

### Naming Conventions

- **Directories:** `kebab-case`
- **React Components:** `PascalCase`
- **Hooks/Utilities:** `camelCase`
- **Styles/Assets:** `kebab-case`
