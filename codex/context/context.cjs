#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const EXCLUDED_DIRS = new Set([
  '.git', '.next', '.svelte-kit', '.turbo', '.venv', 'build', 'coverage', 'dist',
  'node_modules', 'target', 'vendor',
]);
const COLD_MEMORY_DIRS = new Set(['archive', 'reviews', 'sessions', 'templates']);
const SOURCE_EXTENSIONS = new Set(['.c', '.cc', '.cpp', '.cs', '.css', '.go', '.html', '.java', '.js', '.jsx', '.kt', '.php', '.py', '.rb', '.rs', '.scss', '.svelte', '.swift', '.ts', '.tsx', '.vue']);
const STOP_WORDS = new Set(['about', 'after', 'again', 'also', 'and', 'are', 'but', 'can', 'change', 'code', 'does', 'for', 'from', 'have', 'how', 'into', 'its', 'need', 'project', 'should', 'that', 'the', 'this', 'use', 'using', 'want', 'what', 'when', 'where', 'which', 'with']);

function parseArgs(argv) {
  const parsed = { command: argv[0] || 'query', task: '', paths: '', budget: 1200, json: false, refresh: false };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') parsed.json = true;
    else if (arg === '--refresh') parsed.refresh = true;
    else if (arg === '--task') parsed.task = argv[++i] || '';
    else if (arg.startsWith('--task=')) parsed.task = arg.slice(7);
    else if (arg === '--paths') parsed.paths = argv[++i] || '';
    else if (arg.startsWith('--paths=')) parsed.paths = arg.slice(8);
    else if (arg === '--budget') parsed.budget = Number(argv[++i]) || parsed.budget;
    else if (arg.startsWith('--budget=')) parsed.budget = Number(arg.slice(9)) || parsed.budget;
  }
  parsed.budget = Math.max(200, Math.min(parsed.budget, 8000));
  return parsed;
}

function findRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, '.git')) || fs.existsSync(path.join(current, '.codex'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(start);
    current = parent;
  }
}

function walk(dir, predicate, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name) && !predicate.skipDir?.(entry.name, full)) walk(full, predicate, output);
    } else if (predicate.file(full)) {
      output.push(full);
    }
  }
  return output;
}

function relative(root, file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function readText(file, limit = 40000) {
  try {
    const buffer = fs.readFileSync(file);
    if (buffer.includes(0)) return '';
    return buffer.toString('utf8', 0, Math.min(buffer.length, limit));
  } catch {
    return '';
  }
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?\\s*$`, 'mi'));
  return match ? match[1].trim() : '';
}

function markdownEntry(root, file) {
  const text = readText(file);
  if (!text) return null;
  const frontmatter = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)?.[1] || '';
  const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(file, path.extname(file));
  const rel = relative(root, file);
  const kind = scalar(frontmatter, 'kind') || scalar(frontmatter, 'type') || (rel === 'memory/manifest.md' ? 'manifest' : 'document');
  const summary = scalar(frontmatter, 'summary');
  return {
    id: scalar(frontmatter, 'id') || rel,
    kind,
    file: rel,
    line: 1,
    title: scalar(frontmatter, 'title') || heading,
    summary,
    searchText: `${frontmatter}\n${heading}\n${summary}\n${text.slice(0, 12000)}`,
  };
}

function collectMarkdownFiles(root) {
  const files = [];
  for (const name of ['AGENTS.md', 'CONTEXT.md', 'CONTEXT-MAP.md']) {
    const file = path.join(root, name);
    if (fs.existsSync(file)) files.push(file);
  }
  files.push(...walk(path.join(root, 'docs', 'agents'), { file: (file) => file.endsWith('.md') }));
  const memory = path.join(root, 'memory');
  files.push(...walk(memory, {
    skipDir: (name) => COLD_MEMORY_DIRS.has(name),
    file: (file) => file.endsWith('.md') && !['_MOC.md', 'README.md'].includes(path.basename(file)),
  }));
  return [...new Set(files)];
}

function collectMarkdown(root) {
  return collectMarkdownFiles(root).map((file) => markdownEntry(root, file)).filter(Boolean);
}

function collectBreadcrumbs(root) {
  const entries = [];
  const files = walk(root, {
    skipDir: (name, full) => name === 'memory' || full.includes(`${path.sep}.codex${path.sep}context${path.sep}cache`),
    file: (file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()),
  });
  for (const file of files) {
    const lines = readText(file, 250000).split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const marker = lines[index].match(/\barche:\s*(.+)$/i);
      if (!marker) continue;
      const rel = relative(root, file);
      entries.push({
        id: `${rel}:${index + 1}`,
        kind: 'breadcrumb',
        file: rel,
        line: index + 1,
        title: `Breadcrumb in ${path.basename(file)}`,
        summary: marker[1].trim(),
        searchText: `${rel} ${marker[1]}`,
      });
    }
  }
  return entries;
}

function indexPath(root) {
  const key = crypto.createHash('sha1').update(path.resolve(root)).digest('hex');
  return path.join(os.tmpdir(), 'agent-arche-context', `${key}.json`);
}

function buildIndex(root) {
  const entries = [...collectMarkdown(root), ...collectBreadcrumbs(root)];
  const documentFiles = collectMarkdownFiles(root).map((file) => relative(root, file));
  const index = { version: 1, generatedAt: new Date().toISOString(), documentFiles, entries };
  const target = indexPath(root);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`);
  return index;
}

function loadIndex(root, refresh) {
  const target = indexPath(root);
  if (refresh || !fs.existsSync(target)) return buildIndex(root);
  try {
    const index = JSON.parse(fs.readFileSync(target, 'utf8'));
    if (index.version !== 1 || !Array.isArray(index.entries) || !Array.isArray(index.documentFiles)) return buildIndex(root);
    const currentFiles = collectMarkdownFiles(root);
    const generatedAt = Date.parse(index.generatedAt) || 0;
    const changed = currentFiles.length !== index.documentFiles.length
      || currentFiles.some((file) => fs.statSync(file).mtimeMs > generatedAt);
    return changed ? buildIndex(root) : index;
  } catch {
    return buildIndex(root);
  }
}

function terms(value) {
  return [...new Set(value.toLowerCase().match(/[a-z0-9_.\/-]{2,}/g) || [])]
    .filter((term) => !STOP_WORDS.has(term));
}

function rank(entry, task, pathHints) {
  const queryTerms = terms(`${task} ${pathHints}`);
  const text = `${entry.title} ${entry.summary} ${entry.searchText}`.toLowerCase();
  const file = entry.file.toLowerCase();
  let score = entry.kind === 'breadcrumb' ? 2 : 0;
  if (task.length > 5 && text.includes(task.toLowerCase())) score += 20;
  for (const term of queryTerms) {
    if (file.includes(term)) score += 8;
    if (entry.title.toLowerCase().includes(term)) score += 5;
    if (text.includes(term)) score += 2;
  }
  for (const hint of pathHints.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)) {
    if (file.includes(hint) || hint.includes(file)) score += 15;
  }
  if (entry.file.startsWith('memory/handoff/')) score += 2;
  return score;
}

function snippet(root, entry, queryTerms) {
  if (entry.kind === 'breadcrumb') return entry.summary;
  const content = readText(path.join(root, entry.file), 50000).replace(/^---[\s\S]*?---\s*/, '').trim();
  if (!content) return entry.summary;
  const lower = content.toLowerCase();
  const positions = queryTerms.map((term) => lower.indexOf(term)).filter((position) => position >= 0);
  const start = positions.length ? Math.max(0, Math.min(...positions) - 180) : 0;
  const excerpt = content.slice(start, start + 900).trim();
  return `${start > 0 ? '…' : ''}${excerpt}${start + 900 < content.length ? '…' : ''}`;
}

function query(root, index, options) {
  const queryTerms = terms(`${options.task} ${options.paths}`);
  const ranked = index.entries
    .map((entry) => ({ entry, score: rank(entry, options.task, options.paths) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.file.localeCompare(b.entry.file));
  const selected = [];
  let remaining = options.budget * 4;
  for (const item of ranked) {
    if (selected.length >= 6 || remaining < 180) break;
    const excerpt = snippet(root, item.entry, queryTerms).slice(0, Math.min(1000, remaining));
    const cost = excerpt.length + item.entry.file.length + 80;
    if (cost > remaining && selected.length > 0) continue;
    selected.push({ ...item, excerpt });
    remaining -= cost;
  }
  return selected;
}

function printPack(selected, options) {
  if (options.json) {
    process.stdout.write(`${JSON.stringify({ task: options.task, results: selected }, null, 2)}\n`);
    return;
  }
  if (selected.length === 0) {
    process.stdout.write('No indexed project context matched. Read only task-relevant files.\n');
    return;
  }
  const lines = ['# Task context pack', ''];
  for (const item of selected) {
    lines.push(`## ${item.entry.file}:${item.entry.line} (${item.entry.kind}, score ${item.score})`);
    lines.push(item.excerpt, '');
  }
  process.stdout.write(`${lines.join('\n').trim()}\n`);
}

function check(index) {
  const issues = [];
  const ids = new Set();
  for (const entry of index.entries) {
    if (ids.has(entry.id)) issues.push(`duplicate id: ${entry.id}`);
    ids.add(entry.id);
    if (entry.file.startsWith('memory/cards/') && (!entry.summary || entry.kind === 'document')) {
      issues.push(`${entry.file}: cards need kind and summary frontmatter`);
    }
  }
  if (issues.length) {
    process.stderr.write(`${issues.join('\n')}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Context index valid: ${index.entries.length} entries.\n`);
  }
}

const options = parseArgs(process.argv.slice(2));
const root = findRoot(process.cwd());
const index = loadIndex(root, options.refresh || options.command === 'index');

if (options.command === 'index') {
  process.stdout.write(`Indexed ${index.entries.length} project context entries.\n`);
} else if (options.command === 'check') {
  check(index);
} else if (options.command === 'harvest') {
  const markers = index.entries.filter((entry) => entry.kind === 'breadcrumb');
  printPack(markers.map((entry) => ({ entry, score: 1, excerpt: entry.summary })), { ...options, json: options.json });
} else if (options.command === 'query') {
  printPack(query(root, index, options), options);
} else {
  process.stderr.write('Usage: context.cjs index|query|check|harvest [--task text] [--paths a,b] [--budget tokens] [--refresh] [--json]\n');
  process.exitCode = 1;
}
