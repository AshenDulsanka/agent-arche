---
name: project-startup
description: First-run project setup for agent-arche. Analyzes a new codebase, seeds the installed root memory vault, and configures docs/agents issue tracker, triage label, and domain-doc context for the engineering skills. Use immediately after installing Full or Small orchestration, Skills + hooks + memory, or when startup context is missing.
argument-hint: "[path to project root, or 'current project']"
user-invocable: true
---

# Project Startup Skill

## Purpose

This is the single first-run entry point for a newly installed agent-arche project.

It does two jobs in one skill folder:

1. Analyze the codebase, interview the user only for missing context, and seed durable project memory with decisions, patterns, learnings, and a feature index.
2. Configure the engineering skill context in `docs/agents/` so skills know this repo's issue tracker workflow, triage label vocabulary, and domain documentation layout.

Do not split this flow into separate public skills. Keep startup discoverable as one action.

**Do not start writing memory notes until the investigation and interview phases are complete.** Premature notes will be wrong and mislead future agents.

---

## Phase 0 - Startup State Check

Before doing setup work, inspect the repo and decide what is already done.

### 0.1 Resolve memory vault

Check in this order:

1. `memory/`
2. Legacy `.github/memory/`
3. Legacy `.claude/memory/`
4. Legacy `.codex/memory/`

Use `memory/` as the canonical vault. If a legacy platform-local vault exists and `memory/` does not, move the legacy vault to `memory/` before seeding. If multiple legacy vaults exist and no root vault exists, tell the user what you found and ask which vault should become `memory/`.

Treat memory bootstrap as already done only when the selected `{memoryDir}/_MOC.md` exists and has real project-specific content, not just placeholders.

### 0.2 Check engineering context

Engineering context is complete only when all are true:

- `docs/agents/issue-tracker.md` exists
- `docs/agents/triage-labels.md` exists
- `docs/agents/domain.md` exists
- At least one existing root instruction file (`AGENTS.md` or `CLAUDE.md`) has an `## Agent skills` block

If both memory and engineering context are complete, report that startup is already configured and stop.

---

## Phase 1 - Silent Codebase Investigation

Skip this phase only if memory bootstrap is already complete.

Explore the project autonomously before asking the user anything. This prevents asking questions the codebase already answers.

### 1.1 Read the entry points

Read in this order, skipping files that do not exist:

- `.github/copilot-instructions.md` - tech stack, conventions, constraints
- `AGENTS.md` - Codex project instructions, if present
- `CLAUDE.md` - Claude project memory/context, if present
- `README.md` - purpose, setup, feature overview
- `package.json` / `pyproject.toml` / `Cargo.toml` - dependencies, scripts
- `src/` or `app/` top-level - folder structure
- Any `docs/ARCHITECTURE.md` or `docs/` folder

### 1.2 Map the codebase structure

Identify:

- **Tech stack:** framework, language, runtime, database, styling system
- **Folder layout:** where features, routes, components, utilities, types, tests live
- **API surface:** routes/endpoints and their rough purpose
- **Key patterns already in use:** data flow, error handling, auth, validation, tests
- **Dependencies worth noting:** major libraries and what they are used for

### 1.3 Identify knowledge gaps

After exploring, note only what you could not determine from code or docs:

- Business context: what problem this solves and who uses it
- Why certain technical choices were made
- Which areas are actively changing versus stable
- Known issues or technical debt
- Planned features or upcoming work

---

## Phase 2 - Interview the User

Skip this phase only if memory bootstrap is already complete.

Ask only about things you could not determine in Phase 1. Do not ask things the codebase already answered.

Use the platform's question mechanism if available. Ask in batches of **3-5 questions maximum per round**. After each round, re-evaluate whether you need more information before proceeding.

### Question bank - pick the relevant ones

**Project identity**

- What problem does this project solve? Who are the primary users?
- Is this internal tooling, a consumer product, a B2B SaaS, an API service, or something else?
- What is the current stage: prototype, MVP, production with active users?

**Technical decisions**

- Why was a key framework, database, or language chosen over alternatives?
- Are there architectural constraints the team must work within?
- Is this repo one service, one app, or part of a larger system?

**Current state**

- What are the most important features currently working?
- What is actively being built or changed right now?
- What are the biggest known technical problems or areas of debt?

**Conventions**

- Are there unwritten rules or team conventions not captured in docs?
- Are there naming or structural patterns the team cares deeply about?

**Memory preferences**

- Are there decisions already made that agents should always know?
- Are there past mistakes or anti-patterns agents should avoid?

### Confidence threshold

Continue interviewing until you can answer all of the following:

- [ ] What this system does and who uses it
- [ ] The full tech stack
- [ ] Folder structure and where each type of code lives
- [ ] At least 10 key architectural or technical decisions and their rationale
- [ ] At least 5 known anti-patterns, gotchas, or past mistakes to avoid
- [ ] Current development focus

If the repo is too small or new to support those counts, record the gap explicitly instead of fabricating detail.

---

## Phase 3 - Write the Memory Vault

Skip this phase only if memory bootstrap is already complete.

Write all notes now, in this order. Use templates in `{memoryDir}/templates/` when present.

### 3.1 Architecture decision records

Create one ADR per significant technical decision identified. Number them sequentially starting from `ADR-001`.

File path: `{memoryDir}/decisions/ADR-NNN-slug.md`

Good candidates:

- Framework choice
- Database choice
- Auth strategy
- State management approach
- Styling system choice
- Monorepo versus polyrepo
- Hosting, compliance, or team constraints

Each ADR must use the `decision.md` template when available and include complete frontmatter with `tags`.

### 3.2 Established patterns

Create one pattern note per significant reusable pattern found in the codebase.

File path: `{memoryDir}/patterns/slug.md`

Good candidates:

- API route structure
- Component props and typing
- Error handling and user-facing errors
- Data loading and fetch patterns
- Form handling and validation
- Auth/session checks

Each pattern note must include a real code example from the codebase with a file path.

### 3.3 Known learnings

Create one learning note per known issue, anti-pattern, or technical debt item mentioned by the user or visible in the code.

File path: `{memoryDir}/learnings/slug.md`

Good candidates:

- "We tried X and it caused Y - do not do it"
- Known performance bottlenecks
- Libraries that had breaking changes or were replaced
- Current stack footguns

### 3.4 Feature index

Create one feature note per major existing feature as a lightweight index.

File path: `{memoryDir}/features/slug.md`

Use this minimal format:

```markdown
---
title: "{{feature-name}}"
date: {{date}}
type: feature
status: active
tags:
  - feature
---

# {{feature-name}}

## What It Does
One paragraph describing the feature and its user value.

## Key Files
| File | Role |
|------|------|
| `path/to/file` | description |

## Related Decisions
- [[decisions/ADR-NNN-slug]]

## Related Patterns
- [[patterns/slug]]
```

### 3.5 Seed the MOC

Replace placeholder sections in `{memoryDir}/_MOC.md` with links to all notes created:

```markdown
## Decisions
- [[decisions/ADR-001-slug]] - one-line summary

## Active Patterns
- [[patterns/slug]] - one-line summary

## Learnings
- [[learnings/slug]] - one-line summary

## Features
- [[features/slug]] - one-line summary
```

---

## Phase 4 - Configure Engineering Skill Context

Skip this phase only if engineering context is already complete.

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker:** where issues live and which commands or files skills should use
- **Triage labels:** tracker labels or local state strings for the five canonical triage roles
- **Domain docs:** where `CONTEXT.md`, `CONTEXT-MAP.md`, and ADRs live

This is prompt-driven, not a deterministic script. Explore, present what you found, confirm unresolved choices with the user, then write.

Do not invent hidden workflow directories or conventions. If a repo does not already have a local markdown issue location, ask for the desired path and record it explicitly.

### 4.1 Explore

Look at the current repo. Read whatever exists; do not assume:

- `git remote -v` and `.git/config`
- `AGENTS.md` and `CLAUDE.md` at the repo root
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/`
- Existing issue or planning locations such as `.github/ISSUE_TEMPLATE/`, `docs/issues/`, `issues/`, `tasks/`, `specs/`, or `docs/` planning artifacts
- Existing labels in the tracker, if a CLI is configured and the user has asked for live verification

### 4.2 Present findings and ask

Summarize what is present and missing. Then walk through only decisions that are not obvious from the repo. If multiple choices are unresolved, ask them one at a time.

**Section A - Issue tracker**

Explain that the issue tracker is where issues live for this repo. Skills like `triage`, `review`, `handoff`, and product planning handoffs need to know whether to call a tracker CLI, write a repo-local markdown file, or follow another workflow.

Default posture:

- If `git remote` points at GitHub, propose GitHub Issues.
- If `git remote` points at GitLab, propose GitLab Issues.
- Otherwise offer GitHub, GitLab, local markdown, or another tracker described by the user.

For local markdown, always ask for the base directory and file naming pattern unless an existing repo convention is obvious.

**Section B - Triage label vocabulary**

Explain that triage moves issues through a state machine and needs the actual label strings configured for this repo.

Canonical roles:

- `needs-triage` - maintainer needs to evaluate
- `needs-info` - waiting on reporter
- `ready-for-agent` - fully specified, AFK-ready
- `ready-for-human` - needs human implementation
- `wontfix` - will not be actioned

Default: each role's string equals its name. Ask whether the user wants overrides.

**Section C - Domain docs**

Explain that some engineering skills read domain context and ADRs before proposing changes.

Confirm the layout:

- **Single-context:** one `CONTEXT.md` plus `docs/adr/` at the repo root
- **Multi-context:** `CONTEXT-MAP.md` at the root pointing to per-context `CONTEXT.md` files

### 4.3 Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to each existing instruction file selected in step 4.4
- The contents of `docs/agents/issue-tracker.md`
- The contents of `docs/agents/triage-labels.md`
- The contents of `docs/agents/domain.md`

Let them edit before writing.

### 4.4 Write

Pick instruction files to edit:

- If `AGENTS.md` exists, edit it.
- If `CLAUDE.md` exists, edit it too.
- If both exist, keep the same `## Agent skills` block in both files.
- If neither exists, ask the user which one to create.

Never create a new instruction file when a repo already has one. Work with the file or files already there.

If an `## Agent skills` block already exists, update its contents in place rather than appending a duplicate.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout - "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Write the three docs files using the seed templates in this folder as starting points:

- [issue-tracker-github.md](./issue-tracker-github.md)
- [issue-tracker-local.md](./issue-tracker-local.md)
- [triage-labels.md](./triage-labels.md)
- [domain.md](./domain.md)

For GitLab or another tracker, write `docs/agents/issue-tracker.md` from scratch using the repo evidence and the user's description.

---

## Phase 5 - Report

After startup, summarize:

```markdown
## Project Startup Complete

### Memory Bootstrap
- Status: created / already present / skipped with reason
- Memory vault: {memoryDir}
- Notes created: X decisions, X patterns, X learnings, X features

### Engineering Skill Context
- Status: created / already present / skipped with reason
- Files: docs/agents/issue-tracker.md, docs/agents/triage-labels.md, docs/agents/domain.md
- Instruction files updated: AGENTS.md and/or CLAUDE.md

### What Agents Now Know
Brief paragraph on what future agents will load before work.

### Gaps Remaining
Anything unresolved or intentionally deferred.
```

## Rules

- Never fabricate information. Ask or leave an explicit `TODO` placeholder.
- Do not overwrite an existing memory vault or `docs/agents/` setup unless the user explicitly asks for a reset.
- Do not create notes for things covered by installed skills; memory is project-specific.
- Every memory note must have complete YAML frontmatter and a `## Related` section with at least one `[[wiki-link]]`.
- File names: `lowercase-kebab-case.md`. ADRs: `ADR-NNN-slug.md`.
- Tags must reflect the domain: `#auth`, `#api`, `#ui`, `#database`, `#performance`, `#security`, `#testing`, etc.
