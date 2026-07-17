#!/usr/bin/env bash
set -euo pipefail

BRANCH=$(git branch --show-current)
USER=$(gh api user --jq '.login')

echo "Creating PR for branch: $BRANCH"
echo "Assignee: $USER"
echo ""
echo "Write a description of what was implemented in this phase:"
echo "(Press Enter to open editor, or Ctrl+C to cancel)"
read -r

if [ -z "$EDITOR" ] && [ -z "$VISUAL" ]; then
  EDITOR="vim"
fi

TMPFILE=$(mktemp)
cat > "$TMPFILE" << EOF
## Description

[Describe what was implemented in this phase]

## Changes

- [Change 1]
- [Change 2]
- [Change 3]

## Testing

- [ ] Lint passed
- [ ] Type check passed
- [ ] Tests passed
- [ ] Manual verification done

## Notes

[Any relevant context, decisions, or blockers]
EOF

${EDITOR:-vim} "$TMPFILE"

DESCRIPTION=$(cat "$TMPFILE")
rm "$TMPFILE"

if [ -z "$DESCRIPTION" ]; then
  echo "Description is empty. Aborting."
  exit 1
fi

gh pr create \
  --base staging \
  --title "$BRANCH" \
  --body "$DESCRIPTION" \
  --assignee "$USER"

echo ""
echo "PR created successfully!"
