#!/usr/bin/env node

const additionalContext = [
  'Read applicable AGENTS.md files. Load only installed skills whose descriptions match the task.',
  'Before broad project or memory reads, run `node .codex/context/context.cjs query --task "<user request>" --paths "<known paths>"` and use the returned context pack. Never read memory/_MOC.md as model context.',
  'Write memory only for durable new decisions, constraints, reusable patterns, recurring gotchas, or an explicit handoff. Routine work needs no memory note.',
  'Keep changes scoped and confirm destructive or external actions.',
].join(' ');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext,
  },
}));
