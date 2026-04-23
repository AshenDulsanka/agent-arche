# agent-arche
Multi-platform AI agent orchestration - specialists for GitHub Copilot, Claude Code, and Codex.

---------------------------------------------

## Install

```bash
npx agent-arche install
```

Run from your project root. The CLI asks which platform you're using and (for Copilot) your subscription tier, then installs the right set of agents, skills, hooks, and rules into your project.

**Platforms supported:**

| Platform | Install destination |
|----------|-------------------|
| GitHub Copilot | `.github/` |
| Claude Code | `.claude/` + `CLAUDE.md` |
| Codex | `.codex/` + `.agents/skills/` + `AGENTS.md` |

**Seed the memory / context file** (do this once after install):
```
@Orchestrator use the analyze-codebase skill on this project
```
This walks through your codebase, interviews you about decisions and context, then populates the project memory file that all agents read in future sessions.

**Update to the latest version later:**
```bash
npx agent-arche update
```

**Verify integrity:**
```bash
npm view agent-arche dist.integrity
```
Compare the hash with the one stored in `agent-arche.json` inside your install directory (`.github/`, `.claude/`, or `.codex/`).

---------------------------------------------

## Manual Setup (alternative)

Copy the appropriate platform folder to your project:
- **Copilot:** `copilot/` → `.github/`, `skills/` → `.github/skills/`, `memory/` → `.github/memory/`
- **Claude Code:** `claude/` → `.claude/`, `skills/` → `.claude/skills/`, `claude/CLAUDE.md` → `CLAUDE.md`
- **Codex:** `codex/config.toml` → `.codex/config.toml`, `codex/agents/` → `.codex/agents/`, `codex/hooks/` → `.codex/hooks/`, `codex/hooks.json` → `.codex/hooks.json`, `codex/instructions/` → `.codex/instructions/`, `codex/rules/` → `.codex/rules/`, `skills/` → `.agents/skills/`, `codex/AGENTS.md` → `AGENTS.md`

For Codex, `.codex/instructions/` is a project convention used by the bundled Codex agents. Those agents inspect the files they are planning, editing, or reviewing and then load every matching instruction file using the same glob patterns as the Copilot setup.

For better PR and issue workflows, copy the `templates/` contents to `.github/` and update the comments inside.

## GitHub Copilot subscription

The CLI automatically adjusts agent models based on your subscription:

| Subscription | Model change |
|---|---|
| **Student** | All Claude models (Sonnet + Opus) → `GPT-5.3-Codex (copilot)`. Designer (Gemini) unchanged. |
| **Pro** | Opus-only agents (Planner, Researcher) → `Claude Sonnet 4.6 (copilot)`. Others unchanged. |
| **Pro+** | No changes, all models stay as configured. |

---------------------------------------------

## Agents

Agents are specialist roles that handle specific types of work. The **Orchestrator** delegates tasks to them, they never run on their own unless invoked directly for single-purpose jobs.

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | The coordination brain. Classifies requests, builds a pipeline of agents, confirms it with the user, then delegates. Never writes code or edits files itself. |
| **Planner** | Creates implementation plans by researching the codebase and skill files. For new features, runs the grill-me → to-prd → to-issues workflow before planning. Never writes code. |
| **Researcher** | Deep-dives into prior art, library docs, CVEs, and GitHub issues before implementation begins. Never writes code. |
| **Coder** | Writes implementation code and unit tests following project conventions. Uses TDD (red-green-refactor) methodology. |
| **Designer** | Handles all UI/UX work, components, layouts, and styling using the project's frontend framework. Never touches server-side code. |
| **Code Reviewer** | Audits code for standards compliance, framework syntax correctness, TypeScript strictness, naming, and error handling. Returns a structured issue report. Never modifies code. |
| **Security Auditor** | Scans for OWASP Top 10 vulnerabilities, injection, broken access control, XSS, hardcoded secrets, SSRF, etc. Never modifies code. |
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

Skills are reference documents that agents load before doing work in a specific domain. They contain best practices, checklists, templates, and anti-patterns.

### Communication

| Skill | Purpose |
|-------|---------|
| `caveman` | **Mandatory default mode.** Compressed communication protocol, drops articles and filler, uses fragments and short synonyms, keeps technical terms exact. Reduces token usage significantly. Disable with "stop caveman" or "normal mode". |
| `caveman-compress` | Compression-optimized variant for maximum brevity. |

### Planning & Process

| Skill | Purpose |
|-------|---------|
| `analyze-codebase` | Bootstraps the memory vault for a new project. Silently explores the codebase, interviews you in batches of 3–5 questions, then writes ADRs, patterns, learnings, and a feature index. Run this once when you first install agent-arche. |
| `grill-me` | Interrogates the user about every aspect of a plan until reaching shared understanding. Walks down each branch of the design tree, resolving dependencies one by one. Used by the Planner before creating a PRD. |
| `to-prd` | Synthesizes the current conversation context into a structured PRD (problem statement, user stories, implementation decisions, testing decisions) and submits it as a GitHub issue. |
| `to-issues` | Breaks a PRD into independently-grabbable GitHub issues using vertical-slice tracer bullets. Each issue cuts through all layers end-to-end rather than slicing horizontally by layer. |
| `tdd` | Test-driven development methodology: red-green-refactor in vertical slices. Includes supporting files on deep modules, interface design for testability, mocking guidelines, and refactoring candidates. |
| `improve-codebase-architecture` | Explores a codebase to find shallow modules and architectural friction, then proposes module-deepening refactors. Spawns multiple sub-agents to design competing interfaces before creating an RFC issue. |

### Design & Aesthetics

| Skill | Purpose |
|-------|---------|
| `design` | The baseline design system, "Anti-Codex" approach with tunable dials (variance, motion, density) to produce human-looking UI. Inspired by Linear, Raycast, Stripe. |
| `soft` | High-end agency aesthetic with vibe archetypes (Ethereal Glass, Editorial Luxury, Soft Structuralism). |
| `minimalist` | Ultra-flat editorial style, warm monochrome, typographic contrast, bento grids, extreme whitespace. No gradients or heavy shadows. |
| `brutalist` | Raw mechanical interfaces, Swiss typographic print meets military terminal aesthetics. Rigid grids, extreme type scale contrast. |
| `redesign` | Surgically upgrades existing UIs to premium quality via Scan → Diagnose → Fix workflow. Identifies generic AI patterns and replaces them. |
| `animate` | Reviews a feature and enhances it with purposeful animations and micro-interactions that improve usability. |
| `gsap` | Advanced GSAP motion engineering, ScrollTrigger animations, editorial typography, gapless bento grids, award-level motion-rich pages. |
| `stitch` | Generates agent-friendly `DESIGN.md` files for Google Stitch with calibrated color, typography, and motion specs. |

### Code Quality & Standards

| Skill | Purpose |
|-------|---------|
| `coding-standards` | Project coding standards, TypeScript strict mode, naming conventions, file organization, error handling patterns, forbidden patterns. |
| `api-design` | REST API conventions, response envelopes, HTTP status codes, Zod validation, pagination, error hierarchy, URL design, and security checklist. |
| `architecture` | Documentation template for describing a system's architecture, folder structure, API surface, data layer, deployment, and design decisions. |
| `critique` | Deep dual-assessment design critique, AI design review (heuristic scoring, cognitive load analysis) combined with manual code review (design tokens, component consistency, a11y). |
| `ui-audit` | Scores a UI across five quality dimensions (including accessibility) on a 0–4 scale with an actionable improvement plan. |
| `ui-optimize` | Diagnoses and fixes UI performance, Core Web Vitals, rendering, animations, images, and bundle size with before/after validation. |
| `seo` | 8-phase prioritized SEO execution plan, technical foundation, metadata, structured data, Core Web Vitals, internal linking, and monitoring. |
| `output` | Overrides default LLM truncation behavior. Demands complete code output, bans placeholder patterns, skeleton code, and `// ...` comments. |

### Git & PR Conventions

| Skill | Purpose |
|-------|---------|
| `commit-conventions` | Conventional Commits format, type prefixes, imperative mood subject lines, 72-char limit, breaking change format. |
| `branch-conventions` | Branch naming format: `<type>/<issue>-<description>` with lowercase-hyphen rules and lifecycle management. |
| `pr-standards` | PR title format, required issue references, description template (What/Why/How to test), 400-line diff limit, squash merge policy. |

## Hooks

Hooks are scripts that run automatically at specific points during an agent session. They enforce safety rules without requiring the agent to remember them.

| Hook | Trigger | What it does |
|------|---------|-------------|
| `session-start.cjs` | **SessionStart** | Injects project startup context: read `AGENTS.md`, use `.codex/config.toml` for MCP/runtime settings, and load matching `.codex/instructions/` files before code work. |
| `pre-tool-safety.cjs` | **PreToolUse** | Blocks clearly destructive Bash commands such as `rm -rf`, `git reset --hard`, `git push --force`, `drop table`, and PowerShell delete variants. |
| `changelog-reminder.cjs` | **Stop** | At the end of a turn, checks whether source files changed without a matching changelog update and reminds the agent before the session closes. |

## Instructions / Rules

Auto-injected coding standards that activate based on which files the agent is working with.

| Rule | Applies to | What it enforces |
|------|-----------|-----------------|
| `typescript` | `**/*.ts`, `**/*.tsx` | TypeScript strict mode, no `any` without comment, explicit return types on exports. |
| `svelte` | `**/*.svelte` | Svelte 5 runes only, correct component structure order. |
| `tests` | `**/*.test.ts`, `**/*.spec.ts` | Test file structure, one `describe` per module, descriptive test names, nested `describe` for groups. |
| `api-routes` | `**/routes/api/**`, `**/api/**`, `**/server/**` | Validate all request input at boundaries, use schema validators, reject unexpected fields. |

In Copilot these are host-native instruction files. In Codex they are implemented by the bundled agents: they read every matching file in `.codex/instructions/` before planning, editing, testing, or reviewing code.

## Codex MCP / Tools

Codex does not use a Copilot-style `tools: [...]` frontmatter list inside agent files.

- Built-in read/edit/execute/browser behavior comes from Codex itself plus `sandbox_mode`, `approval_policy`, and `web_search` in `.codex/config.toml`.
- External capabilities such as GitHub, Context7, and Playwright are configured as MCP servers in `.codex/config.toml`.
- The bundled Codex config ships with disabled example entries for `context7`, `playwright`, `github`, and `openaiDeveloperDocs` so a project can opt in without re-learning the config shape.

## Prompts / Commands

User-invocable shortcuts that perform a single focused task.

| Prompt | Purpose |
|--------|---------|
| `code-review` | Review selected code against project coding standards (TypeScript, naming, error handling, imports). |
| `write-tests` | Write unit tests for selected code, happy path, edge cases, and error cases with proper setup/teardown. |
| `debug` | Systematic debug cycle: reproduce → gather evidence → isolate → hypothesize → verify → fix. |
| `create-issue` | Draft a GitHub issue with title, description, acceptance criteria, labels, and branch name. |
| `pr-description` | Generate a PR description from staged changes, what changed, why, and how to test it. |
| `security-review` | Security review covering all OWASP Top 10 categories against selected code. |

---------------------------------------------

## Memory

Every project gets a persistent context file, agents read and update it automatically across every session.

| Platform | Memory file | Format |
|----------|------------|--------|
| GitHub Copilot | `.github/memory/` (Obsidian vault) | Linked Markdown notes with wiki-links |
| Claude Code | `CLAUDE.md` at project root | Single Markdown file |
| Codex | `AGENTS.md` at project root | Single Markdown file |

After installing, run the `analyze-codebase` skill to seed it with your project's context.

---------------------------------------------

## Credits

Built on top of excellent open-source work:

| Repo | What we took from it |
|------|---------------------|
| [cyxzdev/Uncodixfy](https://github.com/cyxzdev/Uncodixfy/blob/main/SKILL.md) | Design and UI skill inspiration |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Foundation for the `ui-audit`, `ui-optimize`, `critique`, `animate` skills |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `gsap`, `redesign`, `soft`, `minimalist`, `brutalist`, `stitch`, `output`, and other quality-focused skills |
| [anthropics/claude-code frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | Frontend design skill patterns |
| [mattpocock/skills](https://github.com/mattpocock/skills) | `grill-me`, `to-prd`, `to-issues`, `tdd`, and `improve-codebase-architecture` skills |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | `caveman`, and `caveman-compress`  communication skills |
