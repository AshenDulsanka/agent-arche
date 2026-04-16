---
name: architecture
description: Use when documenting, understanding, or reviewing a project's architecture — folder layout, data flow, API surface, database design, deployment setup, and key technical decisions. Provides a documentation template any project can fill in.
---

# Architecture — Project Documentation Guide

## When to Use This Skill

Load this skill when you need to:
- Document how a project is structured for a new contributor
- Understand data flow before planning a new feature
- Review architectural decisions (DB choice, file storage, caching, auth)
- Map out API routes and their responsibilities
- Set up or review Docker/deployment configuration
- Understand how the project's key subsystems interact

**Note:** This skill is a documentation framework, not a description of any specific project. Apply it by filling in the templates below with the actual details of the project you are working on. If working on an existing project, read the project files first and use this skill as a checklist to ensure nothing is undocumented.

---

## What a Good Architecture Document Covers

### 1. What Is This System?
- One paragraph describing what the system does and who uses it.
- The core problem it solves.
- Any domain-specific context needed to understand design choices.

### 2. High-Level Architecture Diagram

Show how the major subsystems communicate. At minimum:

```
[Client / Browser]
       ↕ (HTTP / WebSocket / SSE)
[Application Server]
       ↕                    ↕
[Database / Storage]  [External APIs / Services]
```

Scale up to show multiple servers, queues, CDNs, caching layers, and third-party integrations as the project requires.

### 3. Folder Structure

Document top-level directories and their responsibilities. Fill in actual directories for your project:

```
project-root/
├── src/
│   ├── lib/
│   │   ├── server/     – server-only logic (DB, file I/O, auth)
│   │   ├── components/ – UI components
│   │   └── utils/      – shared utilities
│   └── routes/         – page and API routes
├── static/             – static assets served directly
├── tests/              – unit and integration tests
└── docs/               – project documentation
```

### 4. API Surface

List all API routes and their responsibilities. For each route:
- **Method + Path**: `POST /api/users`
- **Purpose**: What does it do?
- **Input**: Request body shape or query params
- **Output**: Response shape
- **Auth required**: Yes / No / Role

Group routes by domain (e.g. `Auth`, `Users`, `Content`, `Admin`).

### 5. Data Layer

Document how data is stored:
- **Database type** (PostgreSQL, SQLite, MongoDB, etc.) and why it was chosen
- **Key tables/collections** and their relationships
- **Schema management**: migrations, seeding, ORMs/query builders used
- **Connection management**: pooling, singleton pattern, WAL mode (if SQLite)
- **File storage**: local disk, S3, object storage — paths and access patterns

### 6. Authentication & Authorisation

- Auth strategy (JWT, session cookies, OAuth, API keys)
- Where tokens/sessions are validated (middleware, load functions, API routes)
- Role/permission model if applicable

### 7. Deployment & Infrastructure

- **Environments**: dev / staging / production
- **Hosting**: where it runs (Vercel, Fly.io, VPS, Docker Swarm, etc.)
- **Docker**: note if a `docker-compose.yml` and `Dockerfile` exist; describe what they configure
- **Environment variables**: list all required env vars (never their values), what they control, and whether the app fails fast on missing values
- **CI/CD**: pipeline overview (lint → test → build → deploy)

### 8. Key Design Decisions

A short table of major technical choices and the rationale:

| Decision | Choice | Why |
|----------|--------|-----|
| Database | SQLite | Single-user, self-hosted; no separate DB process needed |
| Auth | Session cookies | Server-rendered app; no SPA token management needed |
| Framework | SvelteKit | Full-stack with excellent DX; Svelte 5 runes for reactive UI |

### 9. Data Flow Walkthroughs

For the 2–3 most critical user actions, walk through the full request-response cycle:

```
1. User submits form
2. Client calls POST /api/resource with validated payload
3. API route validates input (Zod/schema check)
4. Server writes to database
5. Server returns { id, slug }
6. Client navigates to /resource/[id]
```

Walkthroughs expose implicit dependencies, missing error handling, and performance bottlenecks.

### 10. Known Constraints & Technical Debt

List anything that is:
- A deliberate simplification with a known downside (e.g. "no horizontal scaling — single process")
- A debt item to address later (e.g. "search is linear scan; needs full-text index at scale")
- A security tradeoff (e.g. "no rate limiting on auth endpoints yet")

---

## Documentation Template

Copy and fill in this template for your project:

```markdown
# Architecture: [Project Name]

## Overview
[One paragraph describing the system and who uses it]

## High-Level Diagram
[ASCII or Mermaid diagram showing subsystems and their connections]

## Folder Structure
[Annotated directory tree with one-line descriptions per directory]

## API Routes
[Route table by domain: Method | Path | Purpose | Auth required]

## Data Layer
[DB choice, key tables/collections, schema management, connection pattern]

## Authentication
[Auth strategy and exactly where it is enforced]

## Deployment
[Hosting, Docker setup, list of env vars, CI/CD pipeline]

## Key Design Decisions
[Table: Decision | Choice | Why]

## Critical Data Flows
[Step-by-step walkthroughs of the 2-3 most important user actions]

## Known Constraints
[Deliberate simplifications and technical debt items]
```
