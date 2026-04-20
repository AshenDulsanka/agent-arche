# agent-arche
orchestration files for my projects. agents, skills, hooks, prompts etc. also an extra note, this is currently made for github copilot not claude code, even though i'm planning to make a claude version as well in the future.

---------------------------------------------

## Steps

- just copy the agents, hooks, instructions, prompts and skills to the project root `.github` folder.
- and for better agentic workflow add the `PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, `ISSUE_TEMPLATE` folder that is inside the **templates** folder for better PRs. you need to update them, just read the comments inside them.

## Student Developer Pack issue

- since student developer pack doesn't have claude sonnet or opus, all the agents that has sonnet or opus should be changed to `GPT-5.3-Codex (Copilot)` or `Auto (copilot)` (which most likely uses codex 5.3 as well anyway).

---------------------------------------------

## Agents

Agents are specialist roles that handle specific types of work. The **Orchestrator** delegates tasks to them — they never run on their own unless invoked directly for single-purpose jobs (code review, security audit, etc.).

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | The coordination brain. Classifies requests, builds a pipeline of agents, confirms it with the user, then delegates. Never writes code or edits files itself. |
| **Planner** | Creates implementation plans by researching the codebase and skill files. For new features, runs the grill-me → to-prd → to-issues workflow before planning. Never writes code. |
| **Researcher** | Deep-dives into prior art, library docs, CVEs, and GitHub issues before implementation begins. Never writes code. |
| **Coder** | Writes implementation code and unit tests following project conventions. Uses TDD (red-green-refactor) methodology. |
| **Designer** | Handles all UI/UX work — components, layouts, and styling using the project's frontend framework. Never touches server-side code. |
| **Code Reviewer** | Audits code for standards compliance, framework syntax correctness, TypeScript strictness, naming, and error handling. Returns a structured issue report. Never modifies code. |
| **Security Auditor** | Scans for OWASP Top 10 vulnerabilities — injection, broken access control, XSS, hardcoded secrets, SSRF, etc. Never modifies code. |
| **UX Reviewer** | Reviews UI components for accessibility, usability, interaction design, and cognitive load. Never modifies code. |
| **Tester** | Writes and runs Playwright E2E tests for critical user flows. Focuses on happy path, error path, and edge cases. |
| **Docs Updater** | Updates CHANGELOG, README, and docs/ after implementation is verified. Never touches source code. |

### Pipeline Examples

- **New feature (full):** Planner (grill-me → to-prd → to-issues) → Researcher → Coder + Designer → Code-reviewer + Security-auditor + UX-reviewer → Tester → Docs-updater
- **New feature (quick):** Researcher → Planner → Coder + Designer → Code-reviewer + Security-auditor + UX-reviewer → Tester → Docs-updater
- **Bug fix:** Planner → Coder → Code-reviewer → Tester → Docs-updater
- **UI change:** Designer → Code-reviewer + UX-reviewer → Docs-updater
- **Architecture review:** Planner (improve-codebase-architecture)

## Skills

Skills are reference documents that agents load from `.github/skills/` before doing work in a specific domain. They contain best practices, checklists, templates, and anti-patterns.

### Planning & Process

| Skill | Purpose |
|-------|---------|
| `grill-me` | Interrogates the user about every aspect of a plan until reaching shared understanding. Walks down each branch of the design tree, resolving dependencies one by one. Used by the Planner before creating a PRD. |
| `to-prd` | Synthesizes the current conversation context into a structured PRD (problem statement, user stories, implementation decisions, testing decisions) and submits it as a GitHub issue. |
| `to-issues` | Breaks a PRD into independently-grabbable GitHub issues using vertical-slice tracer bullets. Each issue cuts through all layers end-to-end rather than slicing horizontally by layer. |
| `tdd` | Test-driven development methodology: red-green-refactor in vertical slices. Includes supporting files on deep modules, interface design for testability, mocking guidelines, and refactoring candidates. |
| `improve-codebase-architecture` | Explores a codebase to find shallow modules and architectural friction, then proposes module-deepening refactors. Spawns multiple sub-agents to design competing interfaces before creating an RFC issue. |

### Design & Aesthetics

| Skill | Purpose |
|-------|---------|
| `design` | The baseline design system — "Anti-Codex" approach with tunable dials (variance, motion, density) to produce human-looking UI. Inspired by Linear, Raycast, Stripe. |
| `soft` | High-end agency aesthetic with vibe archetypes (Ethereal Glass, Editorial Luxury, Soft Structuralism). |
| `minimalist` | Ultra-flat editorial style — warm monochrome, typographic contrast, bento grids, extreme whitespace. No gradients or heavy shadows. |
| `brutalist` | Raw mechanical interfaces — Swiss typographic print meets military terminal aesthetics. Rigid grids, extreme type scale contrast. |
| `redesign` | Surgically upgrades existing UIs to premium quality via Scan → Diagnose → Fix workflow. Identifies generic AI patterns and replaces them. |
| `animate` | Reviews a feature and enhances it with purposeful animations and micro-interactions that improve usability. |
| `gsap` | Advanced GSAP motion engineering — ScrollTrigger animations, editorial typography, gapless bento grids, award-level motion-rich pages. |
| `stitch` | Generates agent-friendly `DESIGN.md` files for Google Stitch with calibrated color, typography, and motion specs. |

### Code Quality & Standards

| Skill | Purpose |
|-------|---------|
| `coding-standards` | Project coding standards — TypeScript strict mode, naming conventions, file organization, error handling patterns, forbidden patterns. |
| `api-design` | REST API conventions — response envelopes, HTTP status codes, Zod validation, pagination, error hierarchy, URL design, and security checklist. |
| `architecture` | Documentation template for describing a system's architecture — folder structure, API surface, data layer, deployment, and design decisions. |
| `critique` | Deep dual-assessment design critique — AI design review (heuristic scoring, cognitive load analysis) combined with manual code review (design tokens, component consistency, a11y). |
| `ui-audit` | Scores a UI across five quality dimensions (including accessibility) on a 0–4 scale with an actionable improvement plan. |
| `ui-optimize` | Diagnoses and fixes UI performance — Core Web Vitals, rendering, animations, images, and bundle size with before/after validation. |
| `seo` | 8-phase prioritized SEO execution plan — technical foundation, metadata, structured data, Core Web Vitals, internal linking, and monitoring. |
| `output` | Overrides default LLM truncation behavior. Demands complete code output — bans placeholder patterns, skeleton code, and `// ...` comments. |

### Git & PR Conventions

| Skill | Purpose |
|-------|---------|
| `commit-conventions` | Conventional Commits format — type prefixes, imperative mood subject lines, 72-char limit, breaking change format. |
| `branch-conventions` | Branch naming format: `<type>/<issue>-<description>` with lowercase-hyphen rules and lifecycle management. |
| `pr-standards` | PR title format, required issue references, description template (What/Why/How to test), 400-line diff limit, squash merge policy. |

## Hooks

Hooks are scripts that run automatically at specific points during an agent session. They enforce safety rules without requiring the agent to remember them.

| Hook | Trigger | What it does |
|------|---------|-------------|
| `session-start.cjs` | **SessionStart** | Injects 5 universal safety rules at the start of every session: no hardcoded secrets, validate all input, read skill files first, take reversible actions, commit atomically. |
| `pre-tool-safety.cjs` | **PreToolUse** | Warns before destructive operations — detects `rm -rf`, `git push --force`, `drop table`, `--no-verify` in shell commands, and scans file edits for hardcoded API keys, passwords, and tokens. |
| `changelog-reminder.cjs` | **PostToolUse** | After any file edit to `src/`, checks if a CHANGELOG.md exists and reminds the agent to add an entry under `[Unreleased]`. |

## Instructions

Instructions are auto-injected rules that activate based on which files the agent has open. They apply automatically — agents don't need to read them manually.

| Instruction | Applies to | What it enforces |
|-------------|-----------|-----------------|
| `typescript.instructions.md` | `**/*.ts`, `**/*.tsx` | TypeScript strict mode, no `any` without comment, explicit return types on exports. |
| `svelte.instructions.md` | `**/*.svelte` | Svelte 5 runes only, correct component structure order. |
| `tests.instructions.md` | `**/*.test.ts`, `**/*.spec.ts` | Test file structure — one `describe` per module, descriptive test names, nested `describe` for groups. |
| `api-routes.instructions.md` | `**/routes/api/**`, `**/api/**`, `**/server/**` | Validate all request input at boundaries, use schema validators, reject unexpected fields. |

## Prompts

Prompts are user-invocable commands that perform a single focused task. They're shortcuts — select some code, run the prompt, get the output.

| Prompt | Purpose |
|--------|---------|
| `code-review.prompt.md` | Review selected code against project coding standards (TypeScript, naming, error handling, imports). |
| `write-tests.prompt.md` | Write unit tests for selected code — happy path, edge cases, and error cases with proper setup/teardown. |
| `debug.prompt.md` | Systematic debug cycle: reproduce → gather evidence → isolate → hypothesize → verify → fix. |
| `create-issue.prompt.md` | Draft a GitHub issue with title, description, acceptance criteria, labels, and branch name. |
| `pr-description.prompt.md` | Generate a PR description from staged changes — what changed, why, and how to test it. |
| `security-review.prompt.md` | Security review covering all OWASP Top 10 categories against selected code. |
