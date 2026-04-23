#!/usr/bin/env node

const path = require('path');
const { execFileSync } = require('child_process');

function parseChangedPaths(statusOutput) {
  return statusOutput
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .map((filePath) => filePath.includes(' -> ') ? filePath.split(' -> ').pop() : filePath)
    .filter(Boolean)
    .map((filePath) => filePath.replace(/\\/g, '/'));
}

function isSourceFile(filePath) {
  const ext = path.extname(filePath);
  const sourceExts = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.svelte', '.vue', '.py', '.go', '.rs', '.java',
    '.rb', '.php', '.cs', '.swift', '.kt',
  ]);

  if (filePath.startsWith('.codex/') || filePath.startsWith('.agents/') || filePath.startsWith('docs/')) {
    return false;
  }

  if (/(^|\/)(src|app|pages|components|lib|server|api)\//.test(filePath)) {
    return true;
  }

  return sourceExts.has(ext);
}

let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw || '{}');
    const cwd = input.cwd || process.cwd();
    const status = execFileSync('git', ['-C', cwd, 'status', '--porcelain', '--untracked-files=all'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const changedFiles = parseChangedPaths(status);
    if (!changedFiles.length) {
      process.stdout.write('{}');
      return;
    }

    const changelogCandidates = ['CHANGELOG.md', 'HISTORY.md', 'CHANGES.md'];
    const touchedSource = changedFiles.some(isSourceFile);
    const touchedChangelog = changedFiles.some((filePath) => changelogCandidates.includes(filePath));

    if (touchedSource && !touchedChangelog) {
      process.stdout.write(JSON.stringify({
        systemMessage:
          'Source files changed in this workspace, but no changelog file changed. ' +
          'If this work should be recorded, add an [Unreleased] entry to CHANGELOG.md, HISTORY.md, or CHANGES.md before finishing.',
      }));
      return;
    }
  } catch (_) {
    // Not a git repo or git unavailable — skip silently.
  }

  process.stdout.write('{}');
});
