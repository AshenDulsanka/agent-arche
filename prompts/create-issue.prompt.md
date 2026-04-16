---
description: Draft a GitHub issue for a task or bug. Produces a focused issue with a clear title, problem description, acceptance criteria checklist, affected component, label suggestions, and branch name following branch-conventions/SKILL.md.
---

Draft a GitHub issue based on the following task or bug description:

[Describe the task or bug here]

## Issue Format

Produce a complete GitHub issue with the following sections:

### Title
Concise, specific, 10 words max. Example: `feat: add search filter to workspace sidebar`

### Description
**Problem / Goal:**
What is the current problem or what new capability is needed? One paragraph.

**Context:**
Which part of the app is affected? (UI, API, auth, database, configuration, etc.)

### Acceptance Criteria
A checklist of conditions that must be true for the issue to be complete:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Affected Files / Components (estimated)
List the files most likely to need changes:
- `src/routes/...`
- `src/lib/components/...`
- `src/lib/server/...`

### Labels
Suggest appropriate labels from: `bug`, `enhancement`, `documentation`, `chore`, `security`, `performance`, `dependencies`

### Branch Name
Suggest a branch name following `.github/skills/branch-conventions/SKILL.md`:
- Format: `<type>/<issue-number>-<short-description>`
- Example: `feat/42-workspace-search-filter`
- Cut from `development`

### Notes
Any implementation considerations, constraints, or references to related issues.
