#!/usr/bin/env node
// Runs at session start. Injects universal (non-project-specific) AI safety rules.
// Project-specific rules live in CLAUDE.md or AGENTS.md.
// Framework/language rules auto-load from .claude/rules/ based on file type.
process.stdout.write(JSON.stringify({
  systemMessage:
    'Universal rules (always enforce): ' +
    '(1) Read AGENTS.md, CLAUDE.md, /docs, and /memory/_MOC.md before planning or editing to understand what has already been done and the current project context. ' + 
    '(2) Read the relevant skill files from .claude/skills/ before starting work in that domain. ' + 
    '(3) Never hardcode secrets, API keys, or tokens — use environment variables instead. ' + 
    '(4) Validate all external input before passing it to SQL, file paths, shell commands, or HTML output. ' + 
    '(5) Take small, reversible actions. Confirm destructive operations with the user first. ' + 
    '(6) Use .codex/config.toml for project MCP/runtime settings. Prefer configured MCP servers before ad-hoc fallbacks. ' + 
    '(7) If multiple instruction patterns match, load all matching instruction files. ' + 
    '(8) Maintain the custom Obsidian memory vault at memory/. Read memory/_MOC.md before work when it exists. Before finishing, update memory/ with what was done, including summary, decisions, verification, follow-ups, and any new notes. Keep _MOC.md linked to new notes. ' + 
    '(9) Load .claude/skills/ponytail/SKILL.md now and apply ponytail ultra mode for coding and for the first user-visible response and other responses to the user. Also load .claude/skills/caveman/SKILL.md and apply caveman ultra mode. Both stay active until the user says "stop ponytail", "stop caveman", or "normal mode".'
}));
