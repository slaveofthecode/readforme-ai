# Registry — AI Learning Memory

> This file is read by the AI at the start of every session.
> It is NOT a log. It is accumulated knowledge that prevents
> repeating mistakes and reuses successful patterns.
>
> Update this file after completing each feature or bug fix.

---

## Feature & Bug Registry

| ID  | Type | Name                      | Branch                            | Status    | Date       |
| --- | ---- | ------------------------- | --------------------------------- | --------- | ---------- |
| 001 | feat | Scaffolding               | `feat/001-scaffolding`            | completed | 2025-07-10 |
| 001 | bug  | Doc Issues                | `bug/001-doc-issues`              | completed | 2025-07-10 |
| 002 | bug  | Harness Improvements      | `bug/002-harness-improvements`    | completed | 2026-07-13 |
| 003 | bug  | Harness Specs             | `bug/003-harness-specs`           | completed | 2026-07-13 |
| 004 | bug  | PR Creation Lesson        | `bug/004-pr-creation-lesson`      | completed | 2026-07-13 |
| 005 | bug  | Hydration Fix             | `bug/005-hydration-fix`           | completed | 2026-07-13 |
| 006 | bug  | Roadmap & Status Tracking | `bug/006-roadmap-status-tracking` | completed | 2026-07-13 |
| 002 | feat | Layout & Providers        | `feat/002-layout-providers`       | completed | 2026-07-13 |
| 003 | feat | Database Schema           | `feat/003-database-schema`        | completed | 2026-07-13 |
| 004 | feat | File Upload               | `feat/004-file-upload`            | completed | 2026-07-14 |
| 005 | feat | File Management           | `feat/005-file-management`        | completed | 2026-07-14 |
| 006 | feat | Chat UI                   | `feat/006-chat-ui`                | completed | 2026-07-15 |
| 007 | feat | RAG Pipeline              | `feat/007-rag-pipeline`           | completed | 2026-07-15 |
| 008 | feat | Polish & Optimization     | `feat/008-polish`                 | completed | 2026-07-15 |

---

## Patterns Learned

### Successful Patterns

<!-- Add patterns that worked well and should be reused -->

- **Harness-first setup:** Configuring the full harness (agents, skills, commands) before writing any app code ensures consistent quality from day one.
- **Spec-driven development:** Creating specs in `.harness/specs/` before implementing features ensures clear acceptance criteria and architectural decisions are documented upfront.

### Anti-Patterns to Avoid

<!-- Add patterns that caused problems and must be avoided -->

- **Committing/pushing without explicit authorization:** The AI must NEVER run `git add`, `git commit`, or `git push` unless the user explicitly requests it. "Go ahead", "yes", "apply" do NOT authorize git write operations. Each action (commit, push, PR) requires separate explicit authorization. Rule lives in `.harness/commands/git.md`.
- **Creating PRs without /pr command:** The AI must NEVER create PRs unless the user explicitly types `/pr`. PR creation is ALWAYS user-triggered via `/pr`. Rule lives in `.harness/commands/git.md` section 2.
- **Generic branch naming:** Using `feat/feature-name` without correlating numbers leads to confusion when multiple features exist. Always use `feat/XXX-description` format.
- **Modifying master directly:** The AI must NEVER make any changes on the `master` branch. All work happens on feature/bug branches. Master is only modified via merged PRs. Rule lives in `.harness/commands/git.md` section 2 and `AGENTS.md` section 7.
- **Creating PR without /pr command:** The AI must NEVER create PRs unless the user explicitly types `/pr`. "Go ahead", "yes", "commit" do NOT authorize PR creation. Each git write operation (commit, push, PR) requires its own explicit authorization.

---

## Architecture Decisions

<!-- Document key architectural decisions and their rationale -->

| Decision                                               | Rationale                                                                                                | Date       |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------- |
| Phase-based branching from `master`                    | Isolates each feature/bug, enables safe code review, prevents cascading failures                         | 2025-07-10 |
| SDD + TDD methodology                                  | Specifications first (SDD) prevents scope creep; tests (TDD) prevent regressions                         | 2025-07-10 |
| Separate README.md (harness) and README_APP.md (app)   | Clear separation of concerns: harness governance vs app documentation                                    | 2025-07-10 |
| Specs in `.harness/specs/` (not active/completed dirs) | Living documents with frontmatter status; follows industry best practices (PragSpec, Weaverse, CodeSpec) | 2026-07-13 |

---

## Blockers Resolved

<!-- Document blockers and how they were resolved -->

| Blocker                                          | Solution                                                                                | Resolved By        | Date       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------ | ---------- |
| Branch naming inconsistency (`main` vs `master`) | Standardized to `master` across all docs                                                | bug/001-doc-issues | 2025-07-10 |
| Spanish documentation in English-only project    | Translated README_APP.md, deleted STEP_BY_STEP.md                                       | bug/001-doc-issues | 2025-07-10 |
| PR created without user authorization            | Created .harness/commands/git.md as single source of truth for all git write operations | bug/001-doc-issues | 2025-07-10 |
| Commit/push without explicit authorization       | Added strict authorization rules to git.md, referenced from AGENTS.md and pr.md         | bug/001-doc-issues | 2025-07-10 |

---

## Environment Notes

<!-- Document environment-specific findings (OS, tool versions, quirks) -->

- **Runtime:** Bun (not Node.js) — all commands use `bun` prefix
- **Package manager:** Bun (not npm/yarn) — use `bun add` not `npm install`
- **Test runner:** `bun:test` native — no Jest or Vitest configuration needed

---

## Lessons Learned Registry

<!-- Mirror entries from .harness/lessons-learned.md for quick AI access. Full details live in lessons-learned.md. -->

| Phase    | Error                                                       | Lesson                                                                                                                                                 | Author |
| -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| bug/002  | Making changes directly on master                           | NEVER modify master. Always create a branch first. Master is only modified via merged PRs.                                                             | AI     |
| bug/003  | Creating PR without explicit authorization                  | NEVER create a PR unless user types `/pr`. Commit authorization ≠ PR authorization. Each git write operation requires separate explicit authorization. | AI     |
| bug/005  | Hydration mismatch from browser extensions                  | Always add `suppressHydrationWarning` to both `<html>` and `<body>` tags in Next.js apps                                                               | AI     |
| feat/004 | Prisma 7 models with `Unsupported()` lack create/createMany | Use raw SQL (`prisma.$executeRaw`) for INSERT operations on models with unsupported types                                                              | AI     |
| feat/004 | Gemini SDK TaskType requires enum import                    | Always import and use enum values from third-party SDKs, not string literals                                                                           | AI     |
| feat/004 | PrismaClient needs driver adapter in Prisma 7               | Install and pass `@prisma/adapter-pg` adapter when constructing PrismaClient                                                                           | AI     |
| feat/004 | pdfjs-dist DOMMatrix not defined in Node.js                 | Import from `pdfjs-dist/legacy/build/pdf.mjs` for server-side usage                                                                                    | AI     |
| feat/004 | pdfjs-dist worker fails in bundled environments             | Use `pathToFileURL(resolve(process.cwd(), "node_modules/...")).href` for worker path — works in both Turbopack and Bun tests                           | AI     |
| feat/004 | Gemini text-embedding-004 deprecated (404)                  | Use `gemini-embedding-001` with raw REST API for `outputDimensionality` support (SDK v0.24.1 lacks it)                                                 | AI     |

<!-- Example:
| feat/003-schema | Missing unique constraint on email | Always add `@unique` for natural identifiers | AI |
| bug/002-upload | No file type validation server-side | Always validate MIME type server-side, never trust client | Human |
-->
