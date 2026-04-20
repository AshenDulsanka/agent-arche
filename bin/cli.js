#!/usr/bin/env node
'use strict';

const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const PACKAGE_ROOT = path.join(__dirname, '..');
const SOURCE_DIRS  = ['agents', 'hooks', 'instructions', 'prompts', 'skills', 'memory'];
const META_FILE    = 'agent-arche.json';
const IS_TTY       = Boolean(process.stdout.isTTY);

// ---------------------------------------------------------------------------
// ANSI helpers (zero dependencies)
// ---------------------------------------------------------------------------
const ESC = '\x1b';

const c = {
  reset:   (s) => `${ESC}[0m${s}${ESC}[0m`,
  bold:    (s) => `${ESC}[1m${s}${ESC}[0m`,
  dim:     (s) => `${ESC}[2m${s}${ESC}[0m`,
  green:   (s) => `${ESC}[32m${s}${ESC}[0m`,
  yellow:  (s) => `${ESC}[33m${s}${ESC}[0m`,
  cyan:    (s) => `${ESC}[36m${s}${ESC}[0m`,
  blue:    (s) => `${ESC}[34m${s}${ESC}[0m`,
  red:     (s) => `${ESC}[31m${s}${ESC}[0m`,
  magenta: (s) => `${ESC}[35m${s}${ESC}[0m`,
};

const cursor = {
  hide:      () => IS_TTY && process.stdout.write(`${ESC}[?25l`),
  show:      () => IS_TTY && process.stdout.write(`${ESC}[?25h`),
  clearLine: () => IS_TTY && process.stdout.write(`\r${ESC}[2K`),
};

process.on('SIGINT',  () => { cursor.show(); process.stdout.write('\n'); process.exit(130); });
process.on('SIGTERM', () => { cursor.show(); process.exit(143); });

// ---------------------------------------------------------------------------
// Spinner  (braille, like Claude Code / Copilot CLI)
// ---------------------------------------------------------------------------
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

class Spinner {
  constructor() {
    this._frame = 0;
    this._timer = null;
    this._text  = '';
  }

  start(text) {
    this._text = text;
    if (!IS_TTY) {
      process.stdout.write(`  ${text}\n`);
      return this;
    }
    cursor.hide();
    this._tick();
    this._timer = setInterval(() => this._tick(), 80);
    return this;
  }

  succeed(text) {
    this._stop();
    if (IS_TTY) process.stdout.write(`\r${ESC}[2K  ${c.green('✓')} ${text}\n`);
    else        console.log(`  ✓ ${text}`);
  }

  fail(text) {
    this._stop();
    if (IS_TTY) process.stdout.write(`\r${ESC}[2K  ${c.red('✗')} ${text}\n`);
    else        console.log(`  ✗ ${text}`);
  }

  _tick() {
    const f = FRAMES[this._frame % FRAMES.length];
    this._frame++;
    process.stdout.write(`\r  ${c.cyan(f)} ${this._text}`);
  }

  _stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    cursor.show();
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Confirmation prompt
// ---------------------------------------------------------------------------
function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

function countDir(src) {
  let n = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countDir(path.join(src, entry.name));
    else n++;
  }
  return n;
}

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

async function install(force = false) {
  const pkg       = readPackageJson();
  const version   = pkg.version;
  const cwd       = process.cwd();
  const githubDir = path.join(cwd, '.github');
  const existing  = readMeta(githubDir);

  if (existing && !force) {
    console.log('');
    console.log(`  ${c.yellow('◆')} ${c.bold('agent-arche')} ${c.dim(`v${existing.version}`)} is already installed.`);
    console.log(`  ${c.dim(`Run ${c.bold('npx agent-arche update')} to upgrade to the latest version.`)}`);
    console.log('');
    return;
  }

  // ── Banner ────────────────────────────────────────────────────────────────
  console.log('');
  console.log(`  ${c.cyan('◆')} ${c.bold('agent-arche')} ${c.dim(`v${version}`)}`);
  if (force && existing) {
    console.log(`  ${c.dim(`Updating from v${existing.version} → v${version}`)}`);
  } else {
    console.log(`  ${c.dim('AI agent orchestration for GitHub Copilot')}`);
  }

  // ── Preview (staggered line reveal) ──────────────────────────────────────
  console.log('');
  const action = force ? 'update' : 'install';
  const actionLabel = force ? 'updated' : 'installed';
  console.log(`  ${c.dim(`The following will be ${actionLabel} into`)} ${c.bold(`${path.basename(cwd)}/.github/`)}`);
  console.log('');

  let previewTotal = 0;
  for (const dir of SOURCE_DIRS) {
    const src = path.join(PACKAGE_ROOT, dir);
    if (!fs.existsSync(src)) continue;
    const n = countDir(src);
    previewTotal += n;
    await sleep(65);
    console.log(`    ${c.dim('→')} ${c.cyan('.github/')}${c.bold(dir + '/')}  ${c.dim(`${n} files`)}`);
  }

  console.log('');
  console.log(`    ${c.dim(`${previewTotal} files total`)}`);
  console.log('');

  // ── Confirmation ──────────────────────────────────────────────────────────
  const verb = force ? 'Update' : 'Install';
  const answer = await confirm(`  ${c.bold('?')} ${verb} now? ${c.dim('(Y/n)')} › `);
  const confirmed = answer === '' || /^y(es)?$/i.test(answer);

  if (!confirmed) {
    console.log('');
    console.log(`  ${c.dim('Aborted.')}`);
    console.log('');
    return;
  }

  // ── Install (animated per-directory) ─────────────────────────────────────
  console.log('');
  const spinner  = new Spinner();
  let totalFiles = 0;
  const missing  = [];

  for (const dir of SOURCE_DIRS) {
    const src  = path.join(PACKAGE_ROOT, dir);
    const dest = path.join(githubDir, dir);

    if (!fs.existsSync(src)) { missing.push(dir); continue; }

    spinner.start(`${c.dim('.github/')}${dir}/`);
    await sleep(500); // enough frames to clearly see the braille spin

    const count = copyDir(src, dest);
    totalFiles += count;

    spinner.succeed(`${c.dim('.github/')}${c.bold(dir + '/')}  ${c.dim(`${count} file${count !== 1 ? 's' : ''}`)}`);
    await sleep(60);
  }

  writeMeta(githubDir, version);

  // ── Summary (staggered reveal) ────────────────────────────────────────────
  console.log('');
  await sleep(120);

  if (force) {
    const prev = existing ? existing.version : '?';
    console.log(`  ${c.green('✓')} ${c.bold(`${totalFiles} files`)} updated  ${c.dim(`v${prev} → v${version}`)}`);
  } else {
    console.log(`  ${c.green('✓')} ${c.bold(`${totalFiles} files`)} installed to ${c.bold('.github/')}`);
    console.log('');
    const steps = [
      `Commit ${c.bold('.github/')} to your repo`,
      `Open Copilot Chat and use ${c.cyan('@Orchestrator')} to start`,
      `Seed memory: ask Orchestrator to ${c.cyan('use the analyze-codebase skill')}`,
    ];
    for (const [i, step] of steps.entries()) {
      await sleep(80);
      console.log(`  ${c.dim(`${i + 1}.`)} ${step}`);
    }
  }

  if (missing.length) {
    console.log('');
    console.log(`  ${c.yellow('!')} Skipped (not in package): ${missing.join(', ')}`);
  }

  console.log('');
}

function showVersion() {
  console.log(readPackageJson().version);
}

function showHelp() {
  console.log(`
  ${c.cyan('◆')} ${c.bold('agent-arche')} ${c.dim('— AI agent orchestration')}

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
    .github/memory/             Persistent Obsidian knowledge vault

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
    install(false).catch((err) => { cursor.show(); console.error(err); process.exit(1); });
    break;
  case 'update':
    install(true).catch((err) => { cursor.show(); console.error(err); process.exit(1); });
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
    console.error(`\n  ${c.red('✗')} Unknown command: ${c.bold(command)}`);
    console.error(`  Run ${c.bold('npx agent-arche --help')} for usage.\n`);
    process.exit(1);
}
