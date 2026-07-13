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
