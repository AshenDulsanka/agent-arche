# orchestration
orchestration files for my projects. agents, skills, hooks, prompts etc.

---------------------------------------------

## Steps

- just copy the agents, hooks, instructions, prompts and skills to the project root `.github` folder.
- and for better agentic workflow add the `PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, `ISSUE_TEMPLATE` folder that is inside the **templates** folder for better PRs. you need to update them, just read the comments inside them.

## Student Developer Pack issue

- since student developer pack doesn't have claude sonnet or opus, all the agents that has sonnet or opus should be changed to `GPT-5.3-Codex (Copilot)` or auto (which most likely uses codex 5.3 as well anyway).
