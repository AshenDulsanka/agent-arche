# Project Memory

<!-- This file is your persistent project context for Claude Code.
     Agents read and update this file to maintain knowledge across sessions.
     Run the project-startup skill once after install to seed this file
     and configure engineering skill context. -->

## Project Overview

<!-- Add your project description, tech stack, and key conventions here -->

## Tech Stack

<!-- List your frameworks, languages, databases, and deployment setup -->

## Key Conventions

<!-- Document the architectural decisions and coding patterns for this project -->

## Established Patterns

<!-- Reusable patterns discovered during development -->

## Known Gotchas

<!-- Anti-patterns, framework quirks, and lessons learned -->

## Architecture Notes

<!-- Module boundaries, data flows, API surface overview -->

## Skill Library

Skills live in `.claude/skills/`. Core bundled skills include Product planning (`product-brainstorming`, `create-prd`, `create-epics-and-stories`), Matt engineering (`grill-me`, `grill-with-docs`, `diagnose`, `handoff`, `improve-codebase-architecture`, `prototype`, `review`, `triage`, `tdd`), code quality and data (`coding-standards`, `karpathy-guidelines`, `api-design`, `postgres-patterns`, `seo`), and workflow support (`project-startup`, `caveman`, `design`, `git`).

---

*Seeded by agent-arche. Agents update this file automatically during sessions.*
*Run `$project-startup` to populate this file and configure engineering skill context.*
