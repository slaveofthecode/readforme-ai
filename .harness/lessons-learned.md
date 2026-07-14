# Lessons Learned

> Registry of errors, causes, fixes, and lessons so neither the AI nor the human repeat the same mistakes in future phases.
>
> Both the AI and the human can add entries here. The AI reads this file at the start of every session and must register any errors it identifies during development before fixing them. The human can add entries when reviewing PRs or discovering issues the AI missed.

## Entry Format

```markdown
## bug/NNN-<phase-name> — YYYY-MM-DD

### Error: short error title

- **Context:** when and where it happened
- **Cause:** what originated it
- **Fix:** what was done to resolve it
- **Lesson:** what must be done next time to avoid it
- **Author:** AI | Human
```

## AI Registration Protocol

When the AI identifies an error during development (type error, logic mistake, anti-pattern, failed test, incorrect assumption, lint violation), it MUST:

1. Register the entry in this file **before** fixing the error
2. Include all fields with `Author: AI`
3. Continue with the fix
4. Reference this lesson at the start of future sessions to avoid repetition

## Human Registration Protocol

When reviewing a PR or discovering an issue the AI missed, the human should:

1. Add an entry with `Author: Human`
2. Include as much context as possible (file, line, scenario)
3. The AI will read and learn from this entry in future sessions

---

## bug/002-harness-improvements — 2026-07-13

### Error: Making changes directly on master branch

- **Context:** Applied harness improvements (lessons-learned.md, AGENTS.md, registry.md) directly on master instead of creating a feature/bug branch first
- **Cause:** Did not follow the branching protocol — all changes must go through a branch and PR, never directly on master
- **Fix:** Reverted changes on master, created bug/002-harness-improvements branch, re-applied changes there
- **Lesson:** NEVER make changes on master. Always create a branch first (feat/ or bug/). Master is only modified via merged PRs.
- **Author:** AI

## bug/003-harness-specs — 2026-07-13

### Error: Creating PR without explicit user authorization

- **Context:** After user authorized commit ("The changes are ready to commit"), AI also created the PR without waiting for explicit `/pr` command
- **Cause:** Misinterpreted user's commit authorization as authorization for all git write operations. PR creation is a SEPARATE action that requires its own explicit authorization via `/pr`
- **Fix:** Asked user about the mistake, will delete the unauthorized PR
- **Lesson:** NEVER create a PR unless user explicitly types `/pr`. Commit authorization ≠ PR authorization. Each git write operation (commit, push, PR) requires separate explicit authorization.
- **Author:** AI

## bug/005-hydration-fix — 2026-07-13

### Error: Hydration mismatch caused by browser extensions

- **Context:** User tested app on mobile browser with Grammarly extension, got hydration error
- **Cause:** Browser extensions (Grammarly, etc.) add attributes to DOM elements after server render, causing React hydration mismatch
- **Fix:** Added `suppressHydrationWarning` prop to `<body>` tag in layout.tsx
- **Lesson:** Always add `suppressHydrationWarning` to both `<html>` and `<body>` tags when building Next.js apps that will be used in browsers with extensions
- **Author:** AI

## feat/003-database-schema — 2026-07-13

### Error: Prisma 7 config requires datasource URL in prisma.config.ts

- **Context:** Running `bunx prisma migrate dev` failed with "The datasource.url property is required in your Prisma config file"
- **Cause:** Prisma 7 with `prisma.config.ts` requires explicit datasource URL configuration, unlike Prisma 5/6 which auto-read from .env
- **Fix:** Added `datasource: { url: process.env.DATABASE_URL! }` to prisma.config.ts
- **Lesson:** When using Prisma 7 with `prisma.config.ts`, always include datasource URL configuration. The `earlyAccess` property does not exist in PrismaConfig type.
- **Author:** AI

### Error: Providers component imported but not used in layout.tsx

- **Context:** ESLint warning "Providers is defined but never used" after adding import
- **Cause:** The Providers component was imported from the scaffolding phase but never wrapped around children in the layout
- **Fix:** Wrapped `{children}` with `<Providers>{children}</Providers>` in the body tag
- **Lesson:** Always verify component imports are actually used. If a component is imported, it should be used or the import should be removed.
- **Author:** AI
