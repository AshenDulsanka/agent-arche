# agent-arche
orchestration files for my projects. agents, skills, hooks, prompts etc.

---------------------------------------------

## Steps

- copy the agents, hooks, instructions, prompts, skills, **and memory** folders to the project root `.github` folder.
- and for better agentic workflow add the `PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, `ISSUE_TEMPLATE` folder that is inside the **templates** folder for better PRs. you need to update them, just read the comments inside them.
- open `.github/memory/` as a vault in Obsidian to browse the project knowledge graph — decisions, patterns, learnings, and sessions are linked with `[[wiki-links]]` and color-coded in graph view.
- run the `analyze-codebase` skill to seed the memory vault with your project's context.

## Student Developer Pack issue

- since student developer pack doesn't have claude sonnet or opus, all the agents that has sonnet or opus should be changed to `GPT-5.3-Codex (Copilot)` or auto (which most likely uses codex 5.3 as well anyway).
