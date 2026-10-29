---
name: project-startup
description: Optional first-run setup for a new or unconfigured Agent Arche project. Build a fixed-size manifest, create only evidenced durable memory cards when memory is installed, and configure docs/agents context. Do not use for established projects whose agent context is already configured.
disable-model-invocation: true
allowed-tools: Bash(node .claude/context/context.cjs *)
---

# Project startup

Use this once for a new or genuinely unconfigured project. Stop immediately when existing project instructions, `docs/agents/`, and the selected workspace features already provide sufficient context.

## 1. Detect the installed scope

Read `.claude/agent-arche.json`.

- `skills`: no hooks or memory setup.
- `skills-hooks`: configure project docs only; no memory.
- `skills-memory` or `subagents`: configure project docs and indexed memory.

Do not create features the selected scope did not install.

## 2. Investigate before asking

Read only existing entry points relevant to configuration:

- Applicable `CLAUDE.md`
- `README.md` and the package manifest
- Top-level application/source layout
- Existing architecture, domain, issue, and contribution docs
- Git remote and existing issue templates

Determine purpose, users, stack, canonical checks, current focus, tracker, domain-doc layout, and durable constraints. Ask concise questions only for decisions the repository cannot answer. Never use quotas for decisions, patterns, features, or gotchas.

## 3. Configure engineering context

Create or update only what is missing:

- `docs/agents/issue-tracker.md`
- `docs/agents/triage-labels.md`
- `docs/agents/domain.md`
- An `## Agent skills` block in an existing root `CLAUDE.md`

Use the reference templates in this skill folder. If no root instruction file exists, ask before creating one. Preserve existing conventions and never invent tracker commands, labels, or domain boundaries.

## 4. Bootstrap memory when installed

Keep `memory/manifest.md` below roughly 250 tokens. Record only:

- Product purpose and primary users
- Stack and deployment
- Canonical check, test, and build commands
- Current active area
- A few cross-cutting durable constraints

Create a separate card only when evidence establishes durable knowledge that will affect future work:

- Architecture or product decision
- Reusable project-specific pattern
- Recurring non-obvious gotcha
- Constraint not obvious from current code

Use the templates in `memory/templates/`. Give every card a stable `id`, `kind`, `status`, one-sentence `summary`, relevant `tags`, `paths`, and `symbols`. Cite repository evidence. Do not create session notes, feature catalogs, or duplicates of source code and existing docs.

Run:

```bash
node .claude/context/context.cjs index --refresh
node .claude/context/context.cjs check
node .claude/context/context.cjs query --task "project startup verification"
```

Do not append links to `memory/_MOC.md`; it must remain fixed-size.

## 5. Report

Report installed scope, files created or updated, unresolved gaps, and the context-query result. Do not claim memory is complete; it should grow only when durable novelty appears.

## Rules

- Never overwrite a configured vault or project convention without explicit permission.
- Never fabricate rationale, commands, labels, or historical mistakes.
- Facts already obvious from code do not need memory duplication.
- Routine work needs no memory note.
- This skill is optional and should not be installed for projects that do not need startup configuration.
