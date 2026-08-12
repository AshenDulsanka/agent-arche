---
name: implement
description: Implement requested code changes end to end from a prompt, spec, or ticket. Use for feature work, diagnosed bug fixes, refactors, and other tasks that require editing code and verifying the result.
---

# Implement

Implement the work described by the user, spec, or ticket.

Read `AGENTS.md` and applicable nested instructions first. Inspect the live code and preserve unrelated user changes.

If installed, load `karpathy-guidelines` and follow it throughout implementation. If installed, use `tdd` where meaningful, at pre-agreed public seams. Missing companion skills are not blockers; apply the same principles directly from the repository instructions and task evidence.

Load only an installed additional skill that matches the work:

- `design` for UI/UX changes.
- `postgres-patterns` for confirmed PostgreSQL work.
- `seo` for search-specific work.
- `security-review` for trust-boundary or security-sensitive changes.

Run typechecking and focused tests regularly, then the relevant broader checks once at the end. Use `code-review` after non-trivial work when it is installed; otherwise perform the same focused Standards and Spec pass directly.

Leave an `arche:` source breadcrumb only when a deliberate, non-obvious constraint would otherwise look like a bug to a future agent and names, tests, or ordinary comments cannot express it. Keep it to one searchable line, link a durable memory ID when one exists, and run `node .codex/context/context.cjs index --refresh`. Do not add agent commentary to routine code.

Do not commit, push, publish, or open a PR unless the user requested it. Load `git` or `handoff` only when that action is requested and the skill is installed; otherwise follow the repository's documented workflow directly.
