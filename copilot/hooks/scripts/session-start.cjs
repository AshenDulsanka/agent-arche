#!/usr/bin/env node
// Runs at session start. Injects universal (non-project-specific) AI safety rules.
// Project-specific rules live in .github/copilot-instructions.md.
// Framework/language rules auto-load from .github/instructions/ based on file type.
process.stdout.write(JSON.stringify({
  systemMessage:
    'Universal rules (always enforce): ' +
    '(1) Never hardcode secrets, API keys, or tokens — use environment variables. ' +
    '(2) Validate all input at system boundaries before use — never pass raw input to SQL, file paths, shell commands, or HTML. ' +
    '(3) Read the relevant skill files in .github/skills/ before starting work in their domain. ' +
    '(4) Take small, reversible actions. Before any destructive operation (delete files, drop data, force-push), confirm with the user. ' +
    '(5) Commit atomically — one logical change per commit with a conventional commit message. ' +
    '(6) Read AGENTS.md before starting work to load project context. Update AGENTS.md with significant decisions, patterns, and learnings after each session. ' +
    '(7) Maintain the Obsidian memory vault at .github/memory/. Read _MOC.md before starting work. Create decision/pattern/learning/review notes with [[wiki-links]] for every significant choice. Update the session note after each phase. Update _MOC.md when done. ' +
    '(8) Caveman full mode is ACTIVE for this entire session. Load .github/skills/caveman/SKILL.md now. Drop articles, filler, hedging. Fragments OK. Short synonyms. Technical terms exact. Code blocks unchanged. Off only if user says "stop caveman" or "normal mode".'
}));
