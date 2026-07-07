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

- **User Trigger:** Run manually after completing a phase branch.
- **AI Role:** The AI does NOT run this command. It can suggest the user to run it and help write the description.
