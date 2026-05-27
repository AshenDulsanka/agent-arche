---
name: git
description: Consolidated Git workflow skill. Use when creating or reviewing branches, commits, pull requests, PR descriptions, squash commits, or release-ready Git hygiene. Loads branch, commit, and PR standards from steps/.
---

# Git Workflow

Use this skill for any Git-facing work. Load only the step files needed for the requested task.

## Step Files

- `steps/branch-conventions.md` - branch names, branch lifecycle, source branch, and examples.
- `steps/commit-conventions.md` - Conventional Commit format, scopes, subject/body/footer rules, and examples.
- `steps/pr-standards.md` - PR titles, issue references, description template, diff limits, screenshots, review, merge, and cleanup.

## Routing

| Task | Load |
|------|------|
| Create or review branch name | `steps/branch-conventions.md` |
| Write, amend, squash, or review commit messages | `steps/commit-conventions.md` |
| Open, update, describe, or review PR | `steps/pr-standards.md` plus `steps/commit-conventions.md` |
| End-to-end Git workflow | all step files |

## Rules

- Keep branches and commits focused on one logical change.
- Prefer existing issue numbers in branch names and PR descriptions.
- Do not run destructive Git operations unless the user explicitly asks and confirms.
- If old instructions mention `branch-conventions`, `commit-conventions`, or `pr-standards`, treat them as aliases for this consolidated `git` skill.
