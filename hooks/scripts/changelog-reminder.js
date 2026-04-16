#!/usr/bin/env node
// Runs after every tool use. If a source file was edited, reminds the agent to update
// the change tracking file — supports CHANGELOG.md, HISTORY.md, or CHANGES.md.
const fs = require('fs');
const path = require('path');

let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { raw += chunk; });
process.stdin.on('end', function() {
  try {
    const input = JSON.parse(raw);
    const toolName = input.toolName || '';
    const editTools = ['replace_string_in_file', 'multi_replace_string_in_file', 'create_file'];

    if (editTools.includes(toolName)) {
      const filePath = (input.toolInput && input.toolInput.filePath) || '';
      const inSrc = /[\/\\]src[\/\\]/.test(filePath);
      const isChangeLog = /CHANGELOG|HISTORY|CHANGES/i.test(filePath);

      if (inSrc && !isChangeLog) {
        // Find which change log file exists in the workspace root
        const cwd = process.cwd();
        const candidates = ['CHANGELOG.md', 'HISTORY.md', 'CHANGES.md'];
        const found = candidates.find(f => fs.existsSync(path.join(cwd, f)));

        if (found) {
          process.stdout.write(JSON.stringify({
            systemMessage:
              `Source file modified. Add an entry to ${found} under [Unreleased] (or equivalent) before finishing this task.`
          }));
          return;
        }
        // No change log file found — skip reminder silently
      }
    }
  } catch (_) { /* invalid or missing stdin - output empty object below */ }
  process.stdout.write('{}');
});
