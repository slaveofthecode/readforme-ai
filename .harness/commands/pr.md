# COMMAND: PULL REQUEST CREATION

## 1. Tooling & Ecosystem

- **CLI:** GitHub CLI (`gh`)
- **Script:** `scripts/pr.sh`
- **Branch Format:** `feat/NNN-<phase-name>`

## 2. Setup

Add this alias to your `~/.zshrc` or `~/.bashrc`:

```bash
alias pr="bash /path/to/scripts/pr.sh"
```

Then reload: `source ~/.zshrc`

## 3. Usage

### Via OpenCode (recommended)

Inside the OpenCode chat, type:

```
/pr
```

The AI will ask you for a description and create the PR automatically.

### Via terminal

```bash
# 1. Stage and commit your changes
git add .
git commit -m "feat: description"

# 2. Push the branch
git push origin feat/NNN-<name>

# 3. Run the PR command
pr
```

## 4. What It Does

- Detects the current branch name and uses it as the PR title.
- Detects your GitHub username and sets you as assignee.
- Opens your editor so you can write the PR description.
- Creates the PR on GitHub targeting `master`.
- Does NOT merge.

## 5. Protocol

- **User Trigger:** Run `/pr` in the OpenCode chat, or `pr` in the terminal.
- **AI Role:** The AI executes the `gh` commands to create the PR, asks for description, and shows the result URL.

## 6. Restrictions

- The AI is **FORBIDDEN** to create Pull Requests without the user explicitly typing `/pr`.
- The user saying "go ahead", "yes", or similar after completing work does **NOT** authorize PR creation.
- The AI may ONLY commit and push when the user explicitly requests it — commit+push and PR creation are separate actions.
- The AI should **NEVER** suggest creating a PR unless the user asks for it.
- For the full set of AI execution rules, see `AGENTS.md` section 4 (Control Commands Automation).
