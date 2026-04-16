---
description: Generate a clear, structured pull request description from the staged changes or a git diff. Covers what changed, why, and how to test it.
---

Generate a pull request description for the following changes.

## What to Include

Read the changes (diff, commit messages, or file list) and produce a PR description in this structure:

---

### What changed
A concise summary of the changes. Focus on the "what", not the "how":
- List the key changes as bullet points
- Group related changes together
- Be specific: "Added email validation to the contact form" not "fixed stuff"

### Why
The motivation or context:
- What problem does this solve?
- Link to any relevant issue or ticket if known
- Why this approach was chosen over alternatives (if non-obvious)

### How to test
Step-by-step instructions for a reviewer to verify the changes work:
1. [Setup step if needed]
2. [Action to take]
3. [What to observe / expected result]

Cover both the happy path and any edge cases that were fixed.

### Screenshots / recordings
[Note any UI changes that need visual verification. Leave placeholder if applicable.]

---

## Style Rules

- Title line: conventional commit format → `type(scope): short description` (max 72 chars)
  - Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
  - Example: `feat(auth): add magic link email sign-in`
- Write in the imperative mood ("Add validation" not "Added validation")
- Be honest about scope — if it's a large PR, say so
- Do not pad with marketing language ("exciting new", "powerful feature", etc.)

## What Not to Include
- Internal implementation details the reviewer doesn't need
- Obvious information (don't describe what TypeScript is)
- Speculation about future work (that belongs in a separate issue)
