---
description: Write Vitest unit tests for the selected TypeScript code. Covers server-side utilities, API route handlers, and data layer functions. Tests must be isolated, deterministic, and follow the project's existing test structure.
---

Write Vitest unit tests for the following code.

## Setup Requirements

Always follow this pattern at the top of the test file:

```typescript
import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';

// Set up any required test fixtures before importing modules that read them
// (e.g. environment variables, temporary directories, mock state)
```

## What to Write

For each exported function in the provided code, write tests covering:

1. **Happy path** — expected input produces expected output
2. **Edge case** — empty string, boundary values, missing optional fields
3. **Error case** — invalid input or missing resource raises the correct error or returns a safe value

## Specific Patterns

### File system functions
```typescript
it('throws when path contains traversal sequence', async () => {
  await expect(readFile('../evil')).rejects.toThrow();
});
```

### Database / storage functions
```typescript
it('returns the same singleton on repeated calls', () => {
  expect(getDb()).toBe(getDb());
});
it('returns a fresh instance after reset', () => {
  const first = getDb();
  resetDb();
  const second = getDb();
  expect(first).not.toBe(second);
});
```

### API route handlers
```typescript
it('returns 400 when required field is missing', async () => {
  const res = await POST({ request: new Request('/', { method: 'POST', body: '{}' }) });
  expect(res.status).toBe(400);
});
```

## Test Quality Rules

- Each `it` block tests exactly one behaviour
- Test descriptions complete the sentence “it ...”
- No test should depend on the side-effects of another test
- Use `beforeEach`/`afterEach` for setup/teardown, not `beforeAll`/`afterAll` unless shared state is genuinely immutable
- Mock external dependencies (HTTP calls, external APIs) — never make real network calls in unit tests

## Output

Write the complete test file. Include all imports. Use descriptive test names that explain the behaviour being tested, not just the function name.
