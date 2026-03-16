# Git Workflow Guide

## How We Set This Up (Local Folder → GitHub Without Manual Upload)

The normal way people push to GitHub is: create a repo on GitHub first, clone it locally, then add files. That requires manually recreating the folder structure.

What we did instead — push an existing local folder directly to GitHub:

```bash
# 1. Install GitHub CLI (one time)
brew install gh

# 2. Log in to your GitHub account (one time)
gh auth login

# 3. Go into your folder
cd /Users/ashish/Documents/Docs/AI/imagekit-performance-playbook

# 4. Initialise git in that folder
git init

# 5. Stage all files
git add .

# 6. Make the first commit
git commit -m "Initial commit"

# 7. Create the GitHub repo and push — all in one command
gh repo create imagekit-performance-playbook --private --source=. --push
```

`--private` keeps the repo visible only to you. Change to `--public` to make it open.
`--source=.` means "use the current folder as the source".
`--push` pushes your commit to GitHub immediately after creating the repo.

The folder structure on disk is preserved exactly as-is on GitHub.

---

## Core Concepts

**Repository (repo):** A folder tracked by git. Contains all your files and the full history of every change ever made.

**Commit:** A saved snapshot of your files at a point in time. Every commit has a message describing what changed.

**Branch:** A separate line of work. You can create a branch to work on something without touching the main codebase. Branches can be merged back when ready.

**Remote:** The copy of the repo on GitHub (as opposed to the local copy on your machine). Called `origin` by convention.

---

## The Three Commands You Used for the Dev Branch

```bash
git checkout -b dev
```
Creates a new branch called `dev` and switches to it immediately.
`-b` means "create this branch". Without `-b`, `checkout` just switches to an existing branch.

```bash
git push origin dev
```
Pushes the `dev` branch to GitHub (origin). First time you do this, GitHub creates the branch remotely.

```bash
git push -u origin dev
```
Same as above but `-u` sets the upstream — it links your local `dev` branch to `origin/dev` permanently.
After this, you can just type `git push` (no need to specify `origin dev` every time).

You only need `-u` once per branch.

---

## Day-to-Day Workflow

### Check where you are
```bash
git status
```
Shows which branch you're on, what files have changed, what's staged.

```bash
git branch
```
Lists all local branches. The one with `*` is your current branch.

### Make changes and save them

```bash
git add .
```
Stages all changed files — marks them as ready to commit.
To stage a specific file only: `git add filename.md`

```bash
git commit -m "Description of what you changed"
```
Saves a snapshot with a message. Good messages are short and specific — "Add pagespeed prompt" not "update".

```bash
git push
```
Sends your local commits to GitHub. If upstream is set (`-u` was used), just `git push` works.

### Switch between branches
```bash
git checkout main
git checkout dev
```
Switches to that branch. Your files update to reflect that branch's state.

### Create a new branch
```bash
git checkout -b feature/new-thing
```
Creates and switches to a new branch called `feature/new-thing`. Branch off from wherever you currently are.

Good habit: always branch off `main` for new work.
```bash
git checkout main
git checkout -b feature/new-thing
```

---

## Merging a Branch Back to Main

When work on a branch is done and you want it in `main`:

```bash
# Switch to main
git checkout main

# Pull latest changes from GitHub first (in case main moved)
git pull

# Merge your branch into main
git merge dev

# Push the updated main to GitHub
git push
```

### Merge via Pull Request (recommended for team work)
Instead of merging locally, push your branch and open a PR on GitHub:

```bash
git push -u origin feature/new-thing
gh pr create --title "Add new thing" --body "Description of what this adds"
```

GitHub lets you review, comment, and merge from the browser. The PR is also a record of what changed and why.

---

## Pulling Updates from GitHub

If changes were made on GitHub (by you or someone else) that aren't on your machine:

```bash
git pull
```
Fetches and merges the latest changes from the remote branch into your current branch.

---

## Useful Commands at a Glance

| Command | What it does |
|---|---|
| `git status` | Show current branch and changed files |
| `git branch` | List local branches |
| `git checkout -b name` | Create and switch to a new branch |
| `git checkout name` | Switch to an existing branch |
| `git add .` | Stage all changes |
| `git add filename` | Stage a specific file |
| `git commit -m "message"` | Commit staged changes with a message |
| `git push` | Push commits to GitHub |
| `git push -u origin name` | Push new branch to GitHub and set upstream |
| `git pull` | Pull latest changes from GitHub |
| `git merge branch-name` | Merge a branch into your current branch |
| `git log --oneline` | See commit history in a compact view |

---

## Why You Should Never Edit Directly on Main

This applies to any repo where main is live or shared — including the ImageKit Docs repo.

**Main is the source of truth.** Whatever is on `main` is what others see, what gets deployed, or what gets reviewed. Pushing changes directly to `main` means there is no review step, no way to catch mistakes before they go live, and no clean history of what changed and why.

**The right habit — always work on a branch:**

1. Create a branch for your change (e.g. `dev`, `fix/image-section`, `update/lcp-docs`)
2. Make your edits on that branch
3. Push the branch to GitHub
4. Open a Pull Request (PR) from that branch into `main` on GitHub
5. Review the diff in the GitHub UI — you can see exactly what lines changed
6. Merge when it looks right

This is especially important for the ImageKit Docs because changes there affect published documentation. A PR gives you a chance to review before anything goes live.

### The Full Flow with PR via GitHub UI

```bash
git checkout main              # Start from main
git pull                       # Get the latest version of main
git checkout -b dev            # Create your branch
# ... make your changes ...
git add .                      # Stage changes
git commit -m "What I changed" # Commit with a clear message
git push -u origin dev         # Push branch to GitHub
```

Now go to GitHub in your browser:

1. Open the repo — GitHub will show a banner: **"dev had recent pushes — Compare & pull request"**
2. Click **Compare & pull request**
3. Add a title and description of what you changed and why
4. Click **Create pull request**
5. Review the diff — green lines are additions, red are removals
6. Click **Merge pull request** when satisfied
7. Delete the branch after merging (GitHub offers this with one click)

After merging, pull `main` locally to keep your machine in sync:

```bash
git checkout main
git pull
```

### Why the PR Step Matters

- You see a clear diff of every line changed before it hits main
- If you made a mistake, you can push another commit to the same branch and the PR updates automatically — nothing is final until you merge
- The PR is a permanent record: what changed, when, and why
- For the ImageKit Docs specifically: it protects published content from accidental edits going live unreviewed

---

## Typical Flow for a New Piece of Work

```bash
git checkout main          # Start from main
git pull                   # Get latest
git checkout -b dev        # Create a branch
# ... make changes to files ...
git add .                  # Stage changes
git commit -m "What I did" # Commit
git push -u origin dev     # Push branch to GitHub (first time)
git push                   # Push again after more commits (upstream already set)
# Then open a Pull Request on GitHub to merge dev → main
```
