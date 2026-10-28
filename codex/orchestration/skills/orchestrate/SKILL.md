---
name: orchestrate
description: Route a complex, divisible engineering task through the project-scoped Codex orchestrator and specialized subagents. Use only when the user explicitly asks for orchestration, subagents, delegation, or parallel agent work. Full orchestration consumes substantially more tokens than a comparable single-agent run.
---

# Orchestrate

Use the `orchestrator` custom agent to own decomposition, delegation, synchronization, and final synthesis.

Do not delegate a task that one agent can complete cleanly. Subagents are justified when at least two bounded workstreams can proceed independently, or when noisy exploration, tests, logs, or review evidence should stay outside the main thread.

Before spawning:

1. Run the context compiler for the user request and known paths.
2. Define the shared goal, hard constraints, approval boundary, and success checks.
3. Split by ownership. Never give two writing agents overlapping files.

Route work to the narrowest agent:

- `code_explorer`: read-only repository mapping and evidence.
- `implementation_worker`: one bounded implementation slice.
- `reviewer`: correctness, security, regression, and test review.
- `test_runner`: focused validation and reduced failure evidence.
- `klaviyo_specialist`: Klaviyo account, flow, profile, event, catalog, template, Customer Agent, and recommendation evidence when installed.
- `shopify_specialist`: Shopify API, theme, catalog, tracking, and webhook evidence when installed.
- `django_integration_specialist`: Django integration endpoints, persistence, jobs, reconciliation, and tests when installed.

Start with no more than three concurrent subagents. Prefer parallel read-heavy work. Sequence exploration before implementation and implementation before final review when outputs depend on each other.

Each subagent prompt must include only its objective, relevant context-pack snippets, owned paths, constraints, expected evidence, output schema, and stop condition. Do not fork or repeat the full conversation.

Require each subagent to return:

```text
status: complete | blocked
summary: concise result
evidence: paths, symbols, commands, and decisive output
changes: files changed, or none
risks: remaining uncertainty
```

Wait for required results, resolve conflicts once, run final integration checks in the main thread, then report one consolidated answer. Do not claim a subagent's result was independently verified unless the main thread checked it.
