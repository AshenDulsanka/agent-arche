---
paths:
  - "**/routes/api/**"
  - "**/api/**"
  - "**/server/**"
---

These rules apply to API routes and server-side code. Security is mandatory.

## Input Validation
- Validate ALL request input at the boundary — body, query params, headers, path params
- Use a schema validator (Zod, Valibot, etc.) — never trust raw `request.json()` output
- Reject unexpected fields — don't silently ignore extra input
- Return 400 with a descriptive error message for invalid input

## Authentication & Authorization
- Check authentication before any data access or mutation
- Check that the authenticated user has permission for the specific resource (not just any logged-in user)
- Never expose internal IDs in error messages that could enable enumeration attacks

## Response Format
```typescript
// Success
return json({ data: result }, { status: 200 });

// Client error  
return json({ error: 'Descriptive message safe to show users' }, { status: 400 });

// Server error — never expose internal details
return json({ error: 'Internal server error' }, { status: 500 });
```
- Never return raw error objects, stack traces, or database error messages
- Log detailed errors server-side, return safe messages to clients

## Security Hardcodes
- Never hardcode secrets, API keys, tokens, or passwords — use environment variables
- Validate environment variables exist at startup, not inside request handlers
- Never log request bodies containing credentials or PII

## File Operations
- Validate file paths resolve within the intended directory — prevent path traversal
- Use `path.resolve()` and verify the result starts with the allowed base path
- Never pass user input directly to `fs` functions or shell commands

## Rate Limiting
- Apply rate limiting to authentication endpoints and sensitive operations
- Return 429 with a `Retry-After` header when limits are exceeded

## Do Not
- Do not use `eval()`, `Function()`, or dynamic `require()` with user input
- Do not build SQL queries with string concatenation — use parameterized queries/ORM
