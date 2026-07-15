#!/usr/bin/env node

const destructivePatterns = [
  { label: 'recursive deletion of a filesystem root or home directory', pattern: /\brm\s+-(?:r[f]?|f[r])\s+(?:\/|~)(?:\s|$)/i },
  { label: 'formatting or overwriting a block device', pattern: /\b(?:mkfs(?:\.\w+)?|dd\s+[^\r\n]*\bof=\/dev\/)/i },
  { label: 'download-and-execute shell pipeline', pattern: /\b(?:curl|wget)\b[^|\r\n]*\|\s*(?:sudo\s+)?(?:bash|sh|zsh|pwsh|powershell)\b/i },
  { label: 'dropping a database or schema', pattern: /\bdrop\s+(?:database|schema)\b/i },
  { label: 'world-writable permissions on a filesystem root', pattern: /\bchmod\s+(?:-r\s+)?777\s+\//i },
  { label: 'recursive deletion of a Windows drive or share root', pattern: /\b(?:remove-item|del|rd|rmdir)\b[^\r\n]*(?:-recurse|\/s)[^\r\n]*(?:[a-z]:\\|\\\\)/i },
];

let raw = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw || '{}');
    const toolName = input.tool_name || '';
    const command = String(input.tool_input && input.tool_input.command || '');

    if (toolName !== 'Bash' || !command) {
      process.stdout.write('{}');
      return;
    }

    const matched = destructivePatterns.find(({ pattern }) => pattern.test(command));
    if (!matched) {
      process.stdout.write('{}');
      return;
    }

    process.stdout.write(JSON.stringify({
      systemMessage: `Blocked ${matched.label}. Use a safer, narrowly scoped operation.`,
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Blocked ${matched.label}.`,
      },
    }));
  } catch (_) {
    process.stdout.write('{}');
  }
});
