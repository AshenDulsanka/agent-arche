---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user asks for a handoff or wants to continue unfinished work in a fresh session.
argument-hint: "[what the next session will focus on]"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Read `.claude/agent-arche.json`: use `memory/handoff/` only for `skills-memory` or `subagents` scopes. For `skills` or `skills-hooks`, use the OS temporary directory unless the repository already has an explicit handoff convention. Delete temporary handoffs after continuation.

Include a compact "Suggested skills" section containing only skills whose trigger conditions match the remaining work. Prefer the normal chain: `diagnosing-bugs` for unresolved bugs, `implement` for edits, `diff-review` after non-trivial edits, and domain skills only when applicable.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Create a handoff only when unfinished state would otherwise be lost. Completed routine work needs no handoff or memory note.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
