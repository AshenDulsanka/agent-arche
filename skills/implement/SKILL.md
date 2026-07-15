---
name: implement
description: Implement requested code changes end to end from a prompt, spec, or ticket. Use for feature work, diagnosed bug fixes, refactors, and other tasks that require editing code and verifying the result.
---

# Implement

Implement the work described by the user, spec, or ticket.

Read `AGENTS.md` and applicable nested instructions first. Inspect the live code and preserve unrelated user changes.

Load `karpathy-guidelines` and follow it throughout implementation. Use `tdd` where meaningful, at pre-agreed public seams.

Load only the additional skill that matches the work:

- `design` for UI/UX changes.
- `postgres-patterns` for confirmed PostgreSQL work.
- `seo` for search-specific work.
- `security-review` for trust-boundary or security-sensitive changes.

Run typechecking and focused tests regularly, then the relevant broader checks once at the end. Use `code-review` after non-trivial work.

Do not commit, push, publish, or open a PR unless the user requested it. Load `git` or `handoff` only when that action is requested.
