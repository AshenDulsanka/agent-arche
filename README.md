# agent-arche

Multi-platform AI agent orchestration for GitHub Copilot, Claude Code, and Codex. It installs specialist agents, shared skills, memory templates, hooks, and project instructions.

## Install

```bash
npx agent-arche install
```

Run it from your project root. The installer asks for:

1. Scope: Full orchestration, Small orchestration, or Skills only
2. Platform: GitHub Copilot, Claude Code, or Codex
3. Copilot plan, only when installing Copilot agents

| Scope | Installs |
|---|---|
| Full orchestration | Full specialist roster, hooks, instructions/rules, prompts/commands, skills, memory, and platform root files |
| Small orchestration | Lean 3-agent setup: Orchestrator, Coder, Docs-updater, plus hooks, instructions/rules, skills, memory, and root files |
| Skills only | Shared `skills/` folder only |

| Platform | Destination |
|---|---|
| GitHub Copilot | `.github/` |
| Claude Code | `.claude/` plus root `CLAUDE.md` |
| Codex | `.codex/`, `.agents/skills/`, plus root `AGENTS.md` |

After installing Full or Small orchestration, run the project startup flow once:

| Platform | Prompt |
|---|---|
| GitHub Copilot | `@Orchestrator use the project-startup skill on this project` |
| Claude Code | `Use the orchestrator agent to run the project-startup skill on this project` |
| Codex | `Use the orchestrator agent to run the project-startup skill on this project` |

Update later with:

```bash
npx agent-arche update
```

## Orchestration

Full orchestration uses specialist agents. Small orchestration keeps the same skills and memory model but routes most work through Coder and Docs-updater.

| Agent | Full orchestration purpose | Small orchestration |
|---|---|---|
| Orchestrator | Classifies work, confirms the agent pipeline, delegates, and never edits files directly | Same coordinator, lower-token routing |
| Planner | Researches the repo and creates implementation plans | Folded into Coder or Orchestrator |
| Researcher | Investigates prior art, docs, issues, CVEs, and unknown libraries | Folded into Coder |
| Coder | Implements code and unit tests | Main executor |
| Designer | Handles UI/UX implementation and visual direction | Folded into Coder with `design` |
| Code-reviewer | Reviews code quality, conventions, TypeScript, and maintainability | Folded into Coder or direct skill use |
| Security-auditor | Reviews auth, routes, secrets, injection, SSRF, file I/O, and OWASP risks | Folded into Coder or direct skill use |
| UX-reviewer | Reviews accessibility, usability, interaction, and visual quality | Folded into Coder with `design` |
| Tester | Writes and runs Playwright flows | Folded into Coder |
| Docs-updater | Updates memory, docs, changelogs, commit text, and PR text | Same docs and memory owner |

Common full pipelines:

| Work | Pipeline |
|---|---|
| New feature | Planner -> Researcher -> Coder + Designer -> Code-reviewer + Security-auditor + UX-reviewer -> Tester -> Docs-updater |
| Bug fix | Planner -> Coder -> Code-reviewer -> Tester -> Docs-updater |
| UI change | Designer -> Code-reviewer + UX-reviewer -> Docs-updater |
| Architecture review | Planner with `improve-codebase-architecture` -> Docs-updater |

## Skill Routing

The public skill surface is the set of top-level folders under `skills/` that contain `SKILL.md`. Design subflows live inside `skills/design/`, and caveman compression lives inside `skills/caveman/`.

| Work type | Full owner | Small owner | Skills |
|---|---|---|---|
| Bootstrap and memory | Orchestrator, Planner | Orchestrator | `project-startup`, `caveman` |
| Product planning | Planner | Orchestrator or Coder | `product-brainstorming`, `create-prd`, `create-epics-and-stories` |
| Planning pressure tests | Planner, Coder | Orchestrator or Coder | `grill-me`, `grill-with-docs`, `triage` |
| Implementation and debugging | Coder, Tester | Coder | `diagnose`, `tdd`, `prototype`, `handoff` |
| Architecture and review | Planner, Code-reviewer | Coder | `improve-codebase-architecture`, `review` |
| Code standards | Coder, Code-reviewer | Coder | `coding-standards`, `karpathy-guidelines`, `api-design`, `postgres-patterns`, `seo` |
| UI/UX | Designer, UX-reviewer | Coder | `design` |
| Git and PRs | Coder, Code-reviewer, Docs-updater | Coder or Docs-updater | `git` |

Recommended order for product work: `project-startup` once, `product-brainstorming`, `create-prd`, then `create-epics-and-stories`.

## Skills

| Skill | Purpose | Example request |
|---|---|---|
| `api-design` | Shapes REST APIs, validation, pagination, error envelopes, status codes, URL design, and API security checks. | "Design the endpoint shape and error responses for this checkout API." |
| `caveman` | Compressed communication mode and context-file compression workflow via `steps/compress.md`. | "Use compressed mode" or "compress AGENTS.md with caveman." |
| `coding-standards` | General code quality rules for TypeScript, naming, file organization, imports, errors, and forbidden patterns. | "Review this module against our coding standards." |
| `create-epics-and-stories` | Turns a PRD into low-dependency epics, stories, acceptance criteria, and build slices. | "Break this PRD into epics and stories for the dev team." |
| `create-prd` | Creates a PRD through a guided workflow and reusable template. | "Create the PRD for this product idea." |
| `design` | Consolidated UI/UX skill for product-fit direction, implementation, redesign, animation, GSAP, styles, audits, critique, optimization, Stitch, and full-output flows. | "Build a polished settings page and audit the checkout flow." |
| `diagnose` | Debug loop for reproduce, isolate, hypothesize, instrument, fix, and regression-test work. | "Diagnose this flaky login test with evidence." |
| `git` | Branch naming, commit conventions, PR standards, and PR body guidance. | "Create the branch name, commits, and PR body for this change." |
| `grill-me` | Pressure-tests a greenfield idea before code or docs exist. | "Interrogate this idea before I start building." |
| `grill-with-docs` | Pressure-tests plans against existing code and docs, then records decisions as context or ADRs. | "Stress-test this plan against the current architecture docs." |
| `handoff` | Produces compact continuation context for another agent, person, or session. | "Create a handoff for the next agent." |
| `improve-codebase-architecture` | Finds shallow modules and architecture friction, then proposes deeper module boundaries and reports. | "Find shallow modules in this subsystem and propose refactors." |
| `karpathy-guidelines` | Coding-agent behavior guardrails: keep changes surgical, avoid overengineering, expose assumptions, and verify results. | "Keep this refactor surgical and call out assumptions before editing." |
| `postgres-patterns` | PostgreSQL schema, query, migration, indexing, RLS, pooling, and review patterns. | "Review this migration for indexes, RLS, and query performance." |
| `product-brainstorming` | Structured product ideation using guided creative techniques and output organization. | "Help me brainstorm the first version of this product." |
| `project-startup` | First-run setup that bootstraps memory and configures `docs/agents/` issue tracker, labels, and domain-doc conventions. | "Run the project startup flow for this repo." |
| `prototype` | Builds disposable logic or UI experiments to answer a product or technical question quickly. | "Prototype this workflow before we commit to the architecture." |
| `review` | Reviews a branch, PR, or diff against standards, specs, risks, and missing tests. | "Review this PR using the engineering review skill." |
| `seo` | SEO execution plan for technical foundation, metadata, structured data, Core Web Vitals, linking, and monitoring. | "Prepare this marketing page for search and sharing." |
| `tdd` | Guides red-green-refactor work with support for deep modules, interfaces, mocks, and refactoring candidates. | "Implement this parser with TDD." |
| `triage` | Moves issues through canonical states and can produce ready-for-agent briefs. | "Move issue 42 to ready-for-agent with an agent brief." |

## Runtime Pieces

| Piece | What it does |
|---|---|
| Hooks | `session-start.cjs` injects startup context, `pre-tool-safety.cjs` blocks destructive commands, and `changelog-reminder.cjs` reminds agents about docs/changelog drift. |
| Instructions/rules | Copilot uses native instruction files. Claude and Codex install equivalent rule/instruction files for TypeScript, Svelte, tests, and API routes. |
| Memory | Full and Small orchestration install a project memory folder. Use `project-startup` once to seed memory and engineering skill context. Skills-only installs do not include memory. |
| Prompts/commands | Copilot prompts and Claude commands include `code-review`, `write-tests`, `debug`, `create-issue`, `pr-description`, and `security-review`. Codex uses agents by name instead. |
| Codex MCP | Codex MCP servers and runtime behavior are configured in `.codex/config.toml`, with disabled examples for Context7, Playwright, GitHub, and OpenAI docs. |

## Manual Setup

The CLI is preferred. For manual installs:

| Platform | Copy |
|---|---|
| Copilot | `copilot/` to `.github/`, `skills/` to `.github/skills/`, `memory/` to `.github/memory/` |
| Claude Code | `claude/` to `.claude/`, `skills/` to `.claude/skills/`, `memory/` to `.claude/memory/`, `claude/CLAUDE.md` to root `CLAUDE.md` |
| Codex | `codex/` contents to `.codex/`, `skills/` to `.agents/skills/`, `memory/` to `.codex/memory/`, `codex/AGENTS.md` to root `AGENTS.md` |

For PR and issue workflows, copy `templates/` into `.github/` and update the comments inside.

## Notes

- Copilot installs adjust agent models by subscription: Student replaces Claude models with Copilot GPT, Pro replaces Opus-only agents with Sonnet, and Pro+ keeps the configured roster.
- Verify published package integrity with `npm view agent-arche dist.integrity` and compare it to `agent-arche.json` in the installed platform folder.

## Credits

Built on top of excellent open-source work:

| Repo | What we took from it |
|---|---|
| [cyxzdev/Uncodixfy](https://github.com/cyxzdev/Uncodixfy/blob/main/SKILL.md) | Design and UI skill inspiration |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Foundation for the `ui-audit`, `ui-optimize`, `critique`, `animate` steps inside the design skill |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `gsap`, `redesign`, `soft`, `minimalist`, `brutalist`, `stitch`, `output`, and other quality-focused steps inside the design skill |
| [anthropics/claude-code frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | Frontend design skill patterns |
| [mattpocock/skills](https://github.com/mattpocock/skills) | `grill-me`, `grill-with-docs`, `tdd`,  `improve-codebase-architecture`, `diagnose`, `handoff`, `prototype`, `review`, `triage`, and `setup-matt-pocock-skills` that is used inside the project startup skills |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | `caveman`, and `caveman-compress`  communication skills |
| [BMad](https://github.com/bmad-code-org/bmad-method) | `bmad-brainstorming`, `bmad-create-prd`, and `bmad-create-epics-and-stories` skills |
| [Akindu23/my-agent-skills](https://github.com/Akindu23/my-agent-skills) | `karapathy-guidelines`, `postgres-patterns` skills |