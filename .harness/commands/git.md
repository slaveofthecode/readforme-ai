# COMMAND: GIT WRITE OPERATIONS AUTHORIZATION

> **Single source of truth** for all git write operations (commit, push, PR).
> Every other file that mentions git writes MUST reference this file.

## 1. Core Principle

The AI is a **code generator**, not an **authorized committer**. All git write operations require **explicit, unambiguous user authorization**.

## 2. Branch Protection — NEVER Modify Master

The `master` branch is **sacred and untouchable**. The AI is **ABSOLUTELY FORBIDDEN** from making ANY changes directly on `master`.

**Protocol:**
1. ALWAYS create a branch before making any changes
2. If the current branch is `master`, the AI MUST run `git checkout -b <branch-name>` before editing any file
3. ALL work happens on feature/bug branches, NEVER on master
4. Changes reach `master` ONLY through merged PRs

**This applies to ALL types of changes:** features, bug fixes, harness improvements, configuration, documentation — everything.

## 3. Authorization Rules

### Commit

- The AI is **FORBIDDEN** to run `git add` or `git commit` without the user explicitly requesting it.
- Phrases like "go ahead", "yes", "do it", "apply" after completing work do **NOT** authorize a commit.
- The user must explicitly say something like: "commit", "make the commit", "commit the changes".
- The AI should NEVER suggest committing unless the user asks for it.

### Push

- The AI is **FORBIDDEN** to run `git push` without the user explicitly requesting it.
- Pushing is a **separate action** from committing — each requires its own authorization.
- The user must explicitly say something like: "push", "push to origin", "push the branch".
- The AI should NEVER auto-push after a commit.

### Pull Request (PR)

- The AI is **FORBIDDEN** to create PRs without the user explicitly typing `/pr`.
- The user saying "go ahead", "yes", or similar after completing work does **NOT** authorize PR creation.
- PR creation is **ALWAYS** user-triggered via `/pr` command.
- For PR-specific details, see `.harness/commands/pr.md`.

## 4. What the AI CAN Do Without Authorization

- Read files (`git status`, `git diff`, `git log`, `git branch`)
- Create branches (`git checkout -b`) — only when user explicitly requests a new branch
- Stage files (`git add`) — only when user explicitly requests staging
- Run verification commands (`bun run lint`, `bun test`, `bun x tsc --noEmit`)

## 5. What the AI CANNOT Do Without Explicit Authorization

- `git add .` or `git add <file>`
- `git commit -m "..."`
- `git push origin <branch>`
- `gh pr create`
- `git merge`
- `git rebase`
- `git reset`
- `git stash` (unless part of a user-requested workflow)

## 6. Authorization Flow

```
User: "commit the changes"
  → AI: git add . && git commit -m "..."
  → AI: "Committed. Do you want me to push?"

User: "push"
  → AI: git push origin <branch>
  → AI: "Pushed. Do you want me to create a PR?"

User: /pr
  → AI: gh pr create ...
  → AI: "PR created: <url>"
```

Each step requires its own explicit authorization. The AI must NEVER chain commit + push + PR without separate authorization for each.

## 7. Exception: Verification Commands

The AI MAY run these commands without explicit authorization because they are read-only:
- `bun run lint`
- `bun run lint:fix`
- `bun x tsc --noEmit`
- `bun test`
- `bunx prisma migrate dev`
- `bunx prisma generate`
- `git status`
- `git diff`
- `git log`

These are **verification steps**, not **write operations**.
