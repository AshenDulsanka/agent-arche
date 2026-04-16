---
name: pr-standards
description: Use when creating or reviewing pull requests. Covers PR title format (Conventional Commits), required issue reference, three-section description template (What changed / Why / How to test), 400-line diff limit, screenshot requirements for UI changes, squash merge strategy, and review requirements.
---

# Pull Request Standards

All pull requests in this repository must follow these standards.

## PR Title

PR titles must follow the same format as commit messages (Conventional Commits — see `commit-conventions/SKILL.md`):

```
<type>(<scope>): <subject>
```

Examples:
- `feat(workspace): add CTF vs general workspace type selection`
- `fix(sync): run wal_checkpoint before git push`
- `docs(readme): add Docker setup instructions`

## Required: Issue Reference

Every PR must reference at least one issue in the description. Use one of:

```
Closes #42
Fixes #17
Refs #55   (for issues that are related but not fully resolved)
```

No issue? Create one before opening the PR.

## PR Description Template

Every PR description must include these three sections:

```markdown
## What changed
<!-- Describe what was changed at a high level. Be specific. -->

## Why
<!-- Explain the motivation. What problem does this solve? What user impact does it have? -->

## How to test
<!-- Step-by-step instructions to verify the change works correctly. -->
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
```

## Diff Size

- No PR should exceed **400 lines of diff** unless unavoidable.
- If a PR must exceed 400 lines, include a justification in the description explaining why it cannot be split.
- Prefer multiple focused PRs over one large PR.

## UI Changes

- **Screenshots or a screen recording are required** for any change that affects the user interface.
- Attach before/after screenshots where applicable.

## Review Requirements

- At least **one approval** is required before merging.
- The author must not merge their own PR without review unless working solo on a personal fork.

## Merge Strategy

- **Squash merge** is preferred to keep `main` history clean and linear.
- Each PR should produce one meaningful commit on `main`.
- The squash commit message must follow the commit conventions.

## Branch Cleanup

Delete the source branch after merging. GitHub can be configured to do this automatically.

## Draft PRs

Use draft PRs (`[Draft]` or GitHub Draft mode) for work in progress that needs early feedback. Do not merge a draft PR.
