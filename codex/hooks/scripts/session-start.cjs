#!/usr/bin/env node

const additionalContext = [
  'Load .agents/skills/caveman/SKILL.md at session start and use caveman ultra for user-visible conversational prose unless the user disables it. Do not compress requested artifacts, code, exact errors, or explanations that require detail.',
  'Before planning or editing, read applicable AGENTS.md files and only the relevant project docs or memory notes that exist.',
  'For implementation, refactoring, or code review, load .agents/skills/karpathy-guidelines/SKILL.md and follow it for that task.',
  'Load other skills only when their descriptions match the request; do not preload the full skill library.',
  `Never hardcode secrets, API keys, or tokens. Use environment variables instead.`,
  `Validate all external input before passing it to SQL, file paths, shell commands, or HTML output.`,
  `Take small, reversible actions. Confirm destructive operations with the user first.`,
  'Maintain the custom Obsidian memory vault at memory/. Read memory/_MOC.md before work when it exists, update memory with what was done before finishing, and keep _MOC.md linked to new notes.',
].join(' ');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext,
  },
}));
