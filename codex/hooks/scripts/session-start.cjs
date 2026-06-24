#!/usr/bin/env node

const additionalContext = [
  'Session start checklist:',
  '1. Read AGENTS.md, /docs, and /memory/_MOC.md to see what has been done already and what the current context is before planning or editing.',
  '2. Read relevant skill files from .agents/skills/ before working in that domain.',
  '3. Never hardcode secrets, API keys, or tokens. Use environment variables instead.',
  '4. Validate all external input before passing it to SQL, file paths, shell commands, or HTML output.',
  '5. Take small, reversible actions. Confirm destructive operations with the user first.',
  '6. Use .codex/config.toml for project MCP/runtime settings. Prefer configured MCP servers before ad-hoc fallbacks.',
  '7. If multiple instruction patterns match, load all matching instruction files.',
  '8. Maintain the custom Obsidian memory vault at memory/. Read memory/_MOC.md before work when it exists, update memory with what was done before finishing, and keep _MOC.md linked to new notes.',
  '9. Load .agents/skills/ponytail/SKILL.md now and apply ponytail ultra mode for coding and for the first user-visible response and other responses to the user, load .agents/skills/caveman/SKILL.md and apply caveman ultra mode. both stays active until the user says "stop ponytail"/"stop caveman" or "normal mode".',
].join(' ');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext,
  },
}));
