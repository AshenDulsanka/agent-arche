---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the `/memory/handoff` directory of the current workspace, if that folder is not there make sure to create it in `/docs/handoff` and delete it after the task is done.

Include a compact "Suggested skills" section containing only skills whose trigger conditions match the remaining work. Prefer the normal chain: `diagnosing-bugs` for unresolved bugs, `implement` for edits, `code-review` after non-trivial edits, and domain skills only when applicable.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
