# Project Instructions

<!-- This file is the main project context for Codex CLI agents.
     Agents read this file at session start and update it with decisions,
     patterns, and learnings after each session. -->

## Project Overview

<!-- Add your project description, purpose, and goals here -->

## Tech Stack

<!-- List your frameworks, languages, databases, deployment setup, and CI/CD -->

## Key Conventions

<!-- Document architectural decisions and coding patterns specific to this project -->

## Agent Roster

This project uses agent-arche — a multi-specialist agent workflow.

| Agent | Role | Model |
|---|---|---|
| Orchestrator | Coordinates all agents, breaks tasks into phases | gpt-5.4 |
| Planner | Creates ordered implementation plans with file assignments | gpt-5.4 |
| Researcher | Deep-dives documentation and codebases for research reports | gpt-5.4 |
| Coder | Implements backend/business logic and unit tests | gpt-5.4 |
| Designer | Implements UI components, layouts, and styling | gpt-5.4 |
| Code-reviewer | Reviews for correctness, maintainability, standards | gpt-5.4 |
| Security-auditor | Audits for OWASP Top 10 vulnerabilities | gpt-5.4 |
| Tester | Writes and runs Playwright E2E tests | gpt-5.4 |
| Docs-updater | Updates CHANGELOG, README, docs | gpt-5.4 |
| UX-reviewer | Reviews usability, accessibility, visual quality | gpt-5.4 |

Run `codex` from the project root, then ask Codex to use the `orchestrator` agent or another custom agent by name.

## Skill Library

Skills live in `.agents/skills/`. Agents load skills before starting work.

## MCP / Tools

Project-scoped MCP servers and Codex runtime settings live in `.codex/config.toml`.

- Built-in read/edit/execute/web capabilities come from Codex itself plus `sandbox_mode`, `approval_policy`, and `web_search`.
- External integrations such as GitHub, Context7, Playwright, and OpenAI Docs are configured under `[mcp_servers.*]` in `.codex/config.toml`.
- The bundled config ships with disabled examples so projects can opt in per workspace without committing secrets.

## Coding Standards

File-type coding guidance lives in `.codex/instructions/`:

| File | Applies to |
|------|-----------|
| `typescript.md` | All `.ts` and `.tsx` files |
| `svelte.md` | All `.svelte` component files |
| `tests.md` | All test files (`.test.ts`, `.spec.ts`, etc.) |
| `api-routes.md` | API routes and server-side code |

Codex does not currently auto-attach these by glob at the host level. Instead, the bundled code-touching and review agents must inspect target file paths and load every matching instruction file before planning, editing, testing, or reviewing code.

Matching rules:
- `**/*.ts,**/*.tsx` → `typescript.md`
- `**/*.svelte` → `svelte.md`
- `**/*.test.ts,**/*.test.js,**/*.spec.ts,**/*.spec.js` → `tests.md`
- `**/routes/api/**,**/api/**,**/server/**` → `api-routes.md`

If multiple patterns match a file, agents load all matching instruction files.

## Established Patterns

<!-- Reusable patterns discovered during development -->

## Known Gotchas

<!-- Anti-patterns, framework quirks, and lessons learned -->

---

*Seeded by agent-arche. Agents update this file automatically during sessions.*
