# Project Memory

<!-- Lean agent-arche install for Claude Code.
     Durable project memory lives in .claude/memory/. -->

## Project Overview

<!-- Add your project description, tech stack, and key conventions here -->

## Tech Stack

<!-- List frameworks, languages, databases, and deployment setup -->

## Key Conventions

<!-- Document architectural decisions and coding patterns for this project -->

## Lean Agent Roster

This project uses the small agent-arche workflow.

| Agent | Role |
|---|---|
| Orchestrator | Coordinates lean flows and delegates only when useful |
| Coder | Researches, plans, edits, and verifies changes |
| Docs-updater | Writes memory notes, docs, commits, and PR text |

## Skill Library

Skills live in `.claude/skills/`. The lean agents load task-specific skills before working:

- Product planning: `product-brainstorming`, `create-prd`, `create-epics-and-stories`
- Matt engineering: `grill-me`, `grill-with-docs`, `diagnose`, `handoff`, `improve-codebase-architecture`, `prototype`, `review`, `triage`, `tdd`
- Code quality and data: `coding-standards`, `karpathy-guidelines`, `api-design`, `postgres-patterns`, `seo`
- Core: `project-startup`, `caveman`, `design`, `git`

## Project Memory

Orchestrator and Coder read `.claude/memory/` before work; Docs-updater is the only agent that writes to it.

---

*Seeded by agent-arche small orchestration.*
