# Project Instructions

<!-- Lean agent-arche install. Codex reads this file at session start.
     Durable project memory lives in .codex/memory/. -->

## Project Overview

<!-- Add your project description, purpose, and goals here -->

## Tech Stack

<!-- List frameworks, languages, databases, deployment, and CI/CD -->

## Key Conventions

<!-- Document architectural decisions and coding patterns specific to this project -->

## Lean Agent Roster

This project uses the small agent-arche workflow.

| Agent | Role |
|---|---|
| Orchestrator | Coordinates lean flows and delegates only when useful |
| Coder | Researches, plans, edits, and verifies changes |
| Docs-updater | Writes memory notes, docs, commits, and PR text |

Run `codex` from the project root, then ask Codex to use the `orchestrator` agent.

## Skill Library

Skills live in `.agents/skills/`. The lean agents load task-specific skills before working:

- Product planning: `product-brainstorming`, `create-prd`, `create-epics-and-stories`
- Matt engineering: `grill-me`, `grill-with-docs`, `diagnose`, `handoff`, `improve-codebase-architecture`, `prototype`, `review`, `triage`, `tdd`
- Code quality and data: `coding-standards`, `karpathy-guidelines`, `api-design`, `postgres-patterns`, `seo`
- Core: `project-startup`, `caveman`, `design`, `git`

## Project Memory

agent-arche installs `.codex/memory/` as a custom Markdown vault. Orchestrator and Coder read it before work; Docs-updater is the only agent that writes to it.

## Coding Standards

File-type coding guidance lives in `.codex/instructions/`. Agents inspect target file paths and load every matching instruction file before planning, editing, testing, or reviewing code.

---

*Seeded by agent-arche small orchestration.*
