#!/usr/bin/env node

let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw || '{}');
    const toolName = input.tool_name || '';
    const command = String(input.tool_input && input.tool_input.command || '').toLowerCase();

    if (toolName !== 'Bash' || !command) {
      process.stdout.write('{}');
      return;
    }

    const destructivePatterns = [
      'rm -rf',
      'rm -r ',
      'git push --force',
      'git push -f',
      'git reset --hard',
      'git clean -fd',
      'del /s',
      'rd /s',
      'rmdir /s',
      'remove-item -recurse',
      'remove-item -force',
      'drop table',
      'drop database',
      'truncate table',
      '--no-verify',
      'chmod 777',
      'curl | bash',
      'wget -o- |',
    ];

    const matched = destructivePatterns.find((pattern) => command.includes(pattern));
    if (!matched) {
      process.stdout.write('{}');
      return;
    }

    process.stdout.write(JSON.stringify({
      systemMessage:
        `Blocked potentially destructive Bash command containing "${matched}". ` +
        'Explain the intent, choose a safer alternative when possible, and get explicit user approval before retrying.',
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Blocked potentially destructive command containing "${matched}".`,
      },
    }));
  } catch (_) {
    process.stdout.write('{}');
  }
});
