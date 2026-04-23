#!/usr/bin/env node

const additionalContext = [
  'Session start checklist:',
  '1. Read AGENTS.md before planning or editing.',
  '2. Read relevant skill files from .agents/skills/ before working in that domain.',
  '3. Never hardcode secrets, API keys, or tokens. Use environment variables instead.',
  '4. Validate all external input before passing it to SQL, file paths, shell commands, or HTML output.',
  '5. Take small, reversible actions. Confirm destructive operations with the user first.',
  '6. Use .codex/config.toml for project MCP/runtime settings. Prefer configured MCP servers before ad-hoc fallbacks.',
  '7. For planning, editing, testing, or review work, inspect target file paths and load every matching instruction file from .codex/instructions/:',
  '   - **/*.ts,**/*.tsx -> typescript.md',
  '   - **/*.svelte -> svelte.md',
  '   - **/*.test.ts,**/*.test.js,**/*.spec.ts,**/*.spec.js -> tests.md',
  '   - **/routes/api/**,**/api/**,**/server/** -> api-routes.md',
  '8. If multiple instruction patterns match, load all matching instruction files.',
  '9. Maintain the custom Obsidian memory vault at .codex/memory/ when the active agent prompt requires it.',
  '10. Caveman full mode is active until the user says "stop caveman" or "normal mode".',
].join(' ');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext,
  },
}));
