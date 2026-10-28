#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const exists = (name) => fs.existsSync(path.join(root, name));

// Emit only lines that apply to this checkout; every byte here is paid on each session start.
// CLAUDE.md is loaded by Claude Code itself, so it is never repeated here.
const lines = [
  'Load a skill only when its description matches the task.',
];
if (exists('.claude/context/context.cjs')) {
  lines.push('Before broad project or memory reads, run `node .claude/context/context.cjs query --task "<request>" --paths "<known paths>"` and use the returned pack.');
}
if (exists('memory/manifest.md')) {
  lines.push('Never read memory/_MOC.md as context. Write memory only for durable decisions, constraints, reusable patterns, recurring gotchas, or an explicit handoff.');
}
lines.push('Prefer Grep/Glob and line-ranged reads over whole-file reads. Keep changes scoped; confirm destructive or external actions.');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join(' '),
  },
}));
