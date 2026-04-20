---
name: analyze-codebase
description: Analyzes a new project's codebase by asking targeted questions until it has enough context, then writes a rich initial memory vault — decisions, patterns, architecture, and a seeded MOC. Use when setting up memory for the first time on a project, or when the vault is empty and agents have no prior context.
argument-hint: "[path to project root, or 'current project']"
user-invocable: true
---

# Memory Bootstrap Skill

## Purpose

You analyze a project from scratch, interview the user until you fully understand the system, and populate `.github/memory/` with a rich starting knowledge base that future agents can build on immediately.

**Do NOT start writing notes until you have completed the investigation and interview phases.** Premature notes will be wrong and mislead future agents.

---

## Phase 1 — Silent Codebase Investigation

Explore the project autonomously before asking the user anything. This prevents asking questions the codebase already answers.

### 1.1 Read the entry points

Read in this order (skip if file doesn't exist):
- `.github/copilot-instructions.md` — tech stack, conventions, constraints
- `README.md` — purpose, setup, feature overview
- `package.json` / `pyproject.toml` / `Cargo.toml` — dependencies, scripts
- `src/` or `app/` top-level — folder structure
- Any `docs/ARCHITECTURE.md` or `docs/` folder

### 1.2 Map the codebase structure

Identify:
- **Tech stack**: framework, language, runtime, database, styling system
- **Folder layout**: where features, routes, components, utilities, types, tests live
- **API surface**: list of routes/endpoints and their rough purpose
- **Key patterns already in use**: how data flows, how errors are handled, how auth works (if present)
- **Dependencies worth noting**: major libraries and what they are used for

### 1.3 Identify knowledge gaps

After exploring, note what you could NOT determine from the codebase alone:
- Business context (what problem does this solve? who are the users?)
- Why certain technical choices were made
- Which areas are actively being worked on vs stable
- Known issues or technical debt the team is aware of
- Planned features or upcoming work

---

## Phase 2 — Interview the User

Ask only about things you could NOT determine in Phase 1. Do NOT ask things the codebase already answered.

Use `vscode/askQuestions` in batches of **3–5 questions maximum per round**. After each round, re-evaluate whether you need more information before proceeding to the next round.

### Question bank — pick the relevant ones, do not ask all of them

**Project identity**
- What problem does this project solve? Who are the primary users?
- Is this internal tooling, a consumer product, a B2B SaaS, an API service, or something else?
- What is the current stage — prototype, MVP, production with active users?

**Technical decisions (only ask if not obvious from code)**
- Why was [framework/database/language] chosen over alternatives?
- Are there any architectural constraints the team must work within (hosting, compliance, team skill set)?
- Is there a monorepo or is this one of multiple services?

**Current state**
- What are the most important features currently working?
- What is actively being built or changed right now?
- What are the biggest known technical problems or areas of debt?

**Conventions (only ask if not in copilot-instructions.md)**
- Are there any unwritten rules or team conventions not captured in docs?
- Are there naming or structural patterns the team cares deeply about?

**Memory preferences**
- Are there any decisions already made that you want agents to always know about?
- Are there any past mistakes or anti-patterns you want agents to avoid?

### Confidence threshold

Continue interviewing until you can answer **all** of the following:
- [ ] What this system does and who uses it
- [ ] The full tech stack (framework, DB, styling, hosting)
- [ ] The folder structure and where each type of code lives
- [ ] At least 10 key architectural/technical decisions and their rationale
- [ ] At least 5 known anti-pattern or past mistake to avoid
- [ ] The current development focus (what's actively changing)

Once all boxes are checked, stop interviewing and move to Phase 3.

---

## Phase 3 — Write the Memory Vault

Write all notes now, in this order. Use the templates in `.github/memory/templates/`.

### 3.1 Architecture decision records

Create one ADR per significant technical decision identified. Number them sequentially starting from `ADR-001`.

File path: `.github/memory/decisions/ADR-NNN-slug.md`

Good candidates for ADRs:
- Framework choice
- Database choice
- Auth strategy
- State management approach
- Styling system choice
- Monorepo vs polyrepo
- Any constraint the user mentioned (compliance, hosting, etc.)

Each ADR must use the `decision.md` template with full frontmatter including `tags`.

### 3.2 Established patterns

Create one pattern note per significant reusable pattern found in the codebase.

File path: `.github/memory/patterns/slug.md`

Good candidates:
- How API routes are structured (request validation, response envelope)
- How components receive and type their props
- How errors are handled and surfaced to users
- How data is loaded (server-side load functions, fetch patterns)
- How forms are handled and validated
- How auth/session is checked in protected routes

Each pattern note must include a real code example from the codebase (with file path).

### 3.3 Known learnings

Create one learning note per known issue, anti-pattern, or technical debt item mentioned by the user or visible in the code.

File path: `.github/memory/learnings/slug.md`

Good candidates:
- "We tried X and it caused Y — don't do it"
- Known performance bottlenecks
- Libraries that had breaking changes or were replaced
- Any footgun in the current stack the user mentioned

### 3.4 Feature index

Create one feature note per major existing feature as a lightweight index.

File path: `.github/memory/features/slug.md`

Use this minimal format (no template):

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

Replace the placeholder sections in `.github/memory/_MOC.md` with links to all notes you created:

```markdown
## Decisions
- [[decisions/ADR-001-slug]] — one-line summary
- [[decisions/ADR-002-slug]] — one-line summary

## Active Patterns
- [[patterns/slug]] — one-line summary

## Learnings
- [[learnings/slug]] — one-line summary

## Features
- [[features/slug]] — one-line summary
```

---

## Phase 4 — Report to User

After writing all notes, summarize:

```
## Memory Bootstrap Complete

### Notes Created
- X decision notes (ADR-001 through ADR-NNN)
- X pattern notes
- X learning notes
- X feature notes
- _MOC.md seeded

### Open Vault
Open `.github/memory/` as a vault in Obsidian to explore the knowledge graph.
Graph view shows: blue=decisions, green=patterns, yellow=learnings, purple=sessions, red=reviews.

### Top Decisions Recorded
- ADR-001: [one-line summary]
- ADR-002: [one-line summary]

### What Agents Now Know
Brief paragraph on what future agents will load from memory before each task.

### Gaps Remaining
Anything you still don't know that agents should find out over time.
```

---

## Rules

- Never fabricate information. If you don't know something, either ask or explicitly leave it as a `TODO` placeholder in the note.
- Do not create notes for things covered by `.github/skills/` — skills are generic; memory is project-specific.
- Every note must have complete YAML frontmatter and a `## Related` section with at least one `[[wiki-link]]`.
- File names: `lowercase-kebab-case.md`. ADRs: `ADR-NNN-slug.md`.
- Tags must reflect the domain: `#auth`, `#api`, `#ui`, `#database`, `#performance`, `#security`, `#testing`, etc.
