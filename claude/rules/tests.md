---
paths:
  - "**/*.test.ts"
  - "**/*.test.js"
  - "**/*.spec.ts"
  - "**/*.spec.js"
---

These rules apply to all test files.

## Structure
- One `describe` block per module or feature
- Test names follow: `'[action] [expected outcome]'` (e.g., `'returns 400 when email is missing'`)
- Group related cases under nested `describe` blocks

## Isolation
- Each test is fully self-contained — no shared mutable state between tests
- Use `beforeEach` / `afterEach` for setup/teardown, not `beforeAll` unless truly expensive
- Never rely on test execution order
- Reset all mocks between tests

## Coverage expectations
Write tests for:
1. **Happy path** — valid input, expected output
2. **Edge cases** — empty values, boundary numbers, null/undefined optional fields
3. **Error cases** — invalid input, missing required data, network/filesystem failures
4. **Security cases** — path traversal (`../`), SQL injection strings, oversized inputs

## Assertions
- Be specific — `expect(result).toBe(42)` not `expect(result).toBeTruthy()`
- Prefer `toEqual` for object deep equality, `toBe` for primitives and references
- Test one thing per `it` block — split multi-assertion tests
