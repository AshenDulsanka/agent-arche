#!/usr/bin/env node
// PreToolUse hook: warns before destructive operations.
// Does NOT block — injects a systemMessage warning so the AI adds its own confirmation step.
let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { raw += chunk; });
process.stdin.on('end', function() {
  try {
    const input = JSON.parse(raw);
    const toolName = input.toolName || '';
    const toolInput = input.toolInput || {};

    // Check run_in_terminal for destructive shell commands
    if (toolName === 'run_in_terminal') {
      const cmd = (toolInput.command || '').toLowerCase();
      const destructivePatterns = [
        'rm -rf', 'rm -r', 'del /s', 'rmdir /s',   // recursive delete
        'git push --force', 'git push -f',            // force push
        'git reset --hard',                            // hard reset
        'git clean -fd', 'git clean -f',              // clean working tree
        'drop table', 'drop database', 'delete from', // database destructive
        '--no-verify',                                 // bypass git hooks
        'truncate table',                              // db truncate
      ];

      const matched = destructivePatterns.find(p => cmd.includes(p));
      if (matched) {
        process.stdout.write(JSON.stringify({
          systemMessage:
            `WARNING: The command contains a potentially destructive operation ("${matched}"). ` +
            'Confirm with the user before running this. Explain exactly what it will do and ask for explicit approval.'
        }));
        return;
      }
    }

    // Check file edits for security-sensitive patterns
    if (['replace_string_in_file', 'multi_replace_string_in_file', 'create_file'].includes(toolName)) {
      const content = JSON.stringify(toolInput).toLowerCase();
      const secretPatterns = [
        /api[_-]?key\s*[:=]\s*['"][a-z0-9_-]{8,}/i,
        /password\s*[:=]\s*['"][^'"]{4,}/i,
        /secret\s*[:=]\s*['"][^'"]{4,}/i,
        /token\s*[:=]\s*['"][a-z0-9_.-]{8,}/i,
      ];

      const hasSecret = secretPatterns.some(p => p.test(content));
      if (hasSecret) {
        process.stdout.write(JSON.stringify({
          systemMessage:
            'WARNING: The file content appears to contain a hardcoded secret (API key, password, or token). ' +
            'Never hardcode secrets in source files. Use environment variables instead. ' +
            'Confirm with the user whether this is intentional.'
        }));
        return;
      }
    }
  } catch (_) { /* invalid or missing stdin - fall through */ }
  process.stdout.write('{}');
});
