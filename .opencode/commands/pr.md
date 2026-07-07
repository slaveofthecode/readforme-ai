---
description: Create a GitHub PR from the current branch targeting master
---

Create a Pull Request for this branch. Do NOT ask the user anything.

1. Run `git branch --show-current` to get the branch name (use it as the PR title)
2. Run `gh api user --jq .login` to get the current GitHub user (use as assignee)
3. Auto-generate the PR description from the branch changes:
   - Run `git log master..HEAD --oneline --no-decorate` to list commits
   - Run `git diff master..HEAD --stat` to list changed files
   - Write a concise description in English summarizing what was implemented
4. Format the description as:

   ## Description
   [summary]

   ## Changes
   - [list of changes from commits]

   ## Files
   [list of changed files]

5. Create the PR with `gh pr create --base master --title "<branch>" --body "<description>" --assignee "<user>"`
6. Show the PR URL when done

Do not merge. Only create. Do not ask for confirmation or description.
