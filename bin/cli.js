#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_ROOT = path.join(__dirname, '..');
const SOURCE_DIRS = ['agents', 'hooks', 'instructions', 'prompts', 'skills', 'memory'];
const META_FILE = 'agent-arche.json';

// ---------------------------------------------------------------------------
// Terminal colours (no dependencies)
// ---------------------------------------------------------------------------
const c = {
  reset: (s) => `\x1b[0m${s}\x1b[0m`,
  bold:  (s) => `\x1b[1m${s}\x1b[0m`,
  dim:   (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow:(s) => `\x1b[33m${s}\x1b[0m`,
  cyan:  (s) => `\x1b[36m${s}\x1b[0m`,
  red:   (s) => `\x1b[31m${s}\x1b[0m`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively copy src → dest. Returns number of files copied. */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function readPackageJson() {
  return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
}

function readMeta(githubDir) {
  const file = path.join(githubDir, META_FILE);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return null; }
}

function writeMeta(githubDir, version) {
  fs.writeFileSync(
    path.join(githubDir, META_FILE),
    JSON.stringify({ version, installedAt: new Date().toISOString() }, null, 2) + '\n',
  );
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function install(force = false) {
  const pkg = readPackageJson();
  const version = pkg.version;
  const cwd = process.cwd();
  const githubDir = path.join(cwd, '.github');
  const existing = readMeta(githubDir);

  if (existing && !force) {
    console.log(c.yellow(`\n  agent-arche v${existing.version} is already installed in this project.`));
    console.log(c.dim(`  Run ${c.bold('npx agent-arche update')} to upgrade to the latest version.\n`));
    process.exit(0);
  }

  const label = force ? 'Updating' : 'Installing';
  console.log(`\n  ${c.bold('agent-arche')} ${c.dim(`v${version}`)}`);
  console.log(`  ${c.dim(label + '...')}\n`);

  let totalFiles = 0;
  const missing = [];

  for (const dir of SOURCE_DIRS) {
    const src  = path.join(PACKAGE_ROOT, dir);
    const dest = path.join(githubDir, dir);
    if (!fs.existsSync(src)) { missing.push(dir); continue; }
    const count = copyDir(src, dest);
    totalFiles += count;
    console.log(`  ${c.green('✓')} .github/${dir}/  ${c.dim(`${count} files`)}`);
  }

  if (missing.length) {
    console.log(`\n  ${c.yellow('!')} Skipped (not found in package): ${missing.join(', ')}`);
  }

  writeMeta(githubDir, version);

  console.log(`\n  ${c.green('✓')} ${totalFiles} files installed to ${c.bold('.github/')}`);
  if (!force) {
    console.log(`\n  ${c.dim('Next steps:')}`);
    console.log(`  ${c.dim('1. Commit .github/ to your repo')}`);
    console.log(`  ${c.dim('2. Open GitHub Copilot Chat and use @Orchestrator to start')}`);
  } else {
    console.log(`\n  ${c.dim('Updated from')} ${c.dim(`v${existing ? existing.version : '?'}`)} ${c.dim('→')} ${c.dim(`v${version}`)}`);
  }
  console.log('');
}

function showVersion() {
  console.log(readPackageJson().version);
}

function showHelp() {
  console.log(`
  ${c.bold('agent-arche')} - AI agent orchestration

  ${c.bold('Usage')}
    npx agent-arche             Install files into .github/ in the current directory
    npx agent-arche install     Same as above
    npx agent-arche update      Update to latest (overwrites all existing files)
    npx agent-arche --version   Print version
    npx agent-arche --help      Show this message

  ${c.bold('What gets installed')}
    .github/agents/             Specialist AI agent definitions
    .github/hooks/              Safety hooks (session-start, pre-tool, changelog)
    .github/instructions/       Auto-injected coding rules by file type
    .github/prompts/            User-invocable task prompts
    .github/skills/             Domain knowledge reference files for agents

  ${c.bold('Source')}
    https://github.com/AshenDulsanka/agent-arche
`);
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

const [,, command] = process.argv;

switch (command) {
  case undefined:
  case 'install':
    install(false);
    break;
  case 'update':
    install(true);
    break;
  case '--version':
  case '-v':
    showVersion();
    break;
  case '--help':
  case '-h':
  case 'help':
    showHelp();
    break;
  default:
    console.error(`\n  ${c.red('Unknown command:')} ${command}`);
    console.error(`  Run ${c.bold('npx agent-arche --help')} for usage.\n`);
    process.exit(1);
}
