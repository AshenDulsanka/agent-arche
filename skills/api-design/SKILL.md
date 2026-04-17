---
name: api-design
description: Designs and reviews server-side API routes — consistent response envelopes, HTTP status codes, input validation, structured error formats, pagination, authentication/authorization patterns, rate limiting, and REST conventions. Use when creating API endpoints, designing response shapes, reviewing route error handling, or auditing an API for consistency and security.
argument-hint: "[route or feature to design/review]"
user-invocable: true
---

# API Design Skill

## Core Principles

1. **Consistent response shape** — every endpoint returns the same envelope
2. **Semantic HTTP status codes** — never `200 OK` with an error body
3. **Validate at boundaries** — all user input validated before any business logic runs
4. **Fail fast, fail clearly** — invalid input returns `400` with a structured error
5. **Never expose internals** — stack traces, DB errors, and file paths stay server-side

---

## Response Envelope

Every endpoint returns the same shape. Clients always check `success` before accessing `data`.

```typescript
// Success
{
  "success": true,
  "data": { ... } | [...] | null,
  "meta"?: { "total": number, "page": number, "limit": number }  // paginated only
}

// Error
{
  "success": false,
  "error": "Human-readable message safe to show users",
  "code"?: "MACHINE_READABLE_CODE"   // optional — for client-side error branching
}
```

### TypeScript Types + Helpers

```typescript
// src/lib/types/api.ts
export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: { total: number; page: number; limit: number };
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// src/lib/utils/api.ts
export function apiSuccess<T>(data: T, meta?: ApiSuccess<T>['meta']): ApiSuccess<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function apiError(error: string, code?: string): ApiError {
  return { success: false, error, ...(code ? { code } : {}) };
}
```

---

## HTTP Status Codes

Use the right code every time. Never return `200` for errors.

| Code | When to use |
|------|-------------|
| `200 OK` | Successful GET, PATCH, PUT |
| `201 Created` | Successful POST that created a resource |
| `204 No Content` | Successful DELETE (no body) |
| `400 Bad Request` | Validation failed, malformed input, missing required fields |
| `401 Unauthorized` | Not authenticated (no session, invalid/expired token) |
| `403 Forbidden` | Authenticated but not authorized for this resource |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Resource already exists (duplicate create) |
| `422 Unprocessable Entity` | Valid format but semantic validation failed |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error — never expose details to client |

---

## Input Validation

Validate at the route boundary before any business logic. Use a schema library (Zod, Valibot, Yup).

### SvelteKit Pattern

```typescript
// src/routes/api/contact/+server.ts
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { apiSuccess, apiError } from '$lib/utils/api';

const ContactSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254),
  message: z.string().min(10).max(2000).trim(),
}).strict(); // reject unexpected fields

export async function POST({ request }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(apiError('Invalid request body'), { status: 400 });
  }

  const result = ContactSchema.safeParse(body);
  if (!result.success) {
    // Log detail server-side; return generic message to client
    // Do NOT expose result.error.issues — reveals your schema to attackers
    console.warn('[POST /api/contact] Validation failed:', result.error.flatten());
    return json(apiError('Validation failed', 'VALIDATION_ERROR'), { status: 400 });
  }

  const { name, email, message } = result.data;
  // Business logic...

  return json(apiSuccess({ sent: true }), { status: 200 });
}
```

### Validation Rules

- Validate **type**, **format**, **constraints** (min/max length, range) for every field
- Use `.strict()` to reject unexpected fields — prevents mass assignment attacks
- Sanitize before storing — strip HTML tags from text fields not expecting markup
- Never trust `Content-Type` header alone — parse and validate the body independently

---

## URL Design

### Route Naming Conventions

```
GET    /api/posts           → list all posts
GET    /api/posts/:id       → get single post
POST   /api/posts           → create post
PATCH  /api/posts/:id       → partial update (send only changed fields)
PUT    /api/posts/:id       → full replacement (send complete resource)
DELETE /api/posts/:id       → delete post
```

### Rules

- **Plural nouns** for collections: `/api/posts` not `/api/post`
- **kebab-case** for multi-word: `/api/blog-posts` not `/api/blogPosts`
- **Hierarchical** for nested: `/api/users/:id/posts`
- **No verbs in URLs**: `/api/posts/:id` not `/api/getPost` or `/api/deletePost`
- **Query params** for filtering, sorting, pagination: `?page=2&limit=10&sort=date&order=desc`

### Versioning

For public APIs prefix with version: `/api/v1/posts`. For private/internal APIs (personal projects), versioning is optional unless you have external consumers.

---

## Pagination

```typescript
// Query params: ?page=1&limit=20
export async function GET({ url }) {
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')));
  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    db.getItems({ offset, limit }),
    db.countItems(),
  ]);

  return json(apiSuccess(items, { total, page, limit }));
}
```

**Cursor-based pagination** (for large, frequently-changing datasets):
- More efficient than offset — no skipped/duplicated rows on concurrent inserts
- Pass `?cursor=<encoded_last_id>&limit=20`
- Return `nextCursor` in meta when more pages exist

---

## Error Handling

### Never Expose Internals

```typescript
// ✗ WRONG — exposes DB schema, file paths, stack traces
return json({ error: err.message }, { status: 500 });

// ✓ CORRECT — generic user message, full detail in server logs
console.error('[POST /api/contact] Unexpected error:', err);
return json(apiError('Something went wrong. Please try again.'), { status: 500 });
```

### Error Hierarchy Pattern

```typescript
export async function POST({ request, params }) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(apiError('Invalid JSON'), { status: 400 });
  }

  // 2. Validate
  const result = Schema.safeParse(body);
  if (!result.success) {
    return json(apiError('Validation failed', 'VALIDATION_ERROR'), { status: 400 });
  }

  // 3. Auth
  const session = await getSession(request);
  if (!session) {
    return json(apiError('Authentication required'), { status: 401 });
  }

  // 4. Business logic in try/catch
  try {
    const data = await doBusinessLogic(result.data);
    return json(apiSuccess(data), { status: 200 });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return json(apiError(err.message), { status: 404 });
    }
    if (err instanceof ConflictError) {
      return json(apiError(err.message, 'CONFLICT'), { status: 409 });
    }
    // Unknown — log and return generic 500
    console.error('[route handler]', err);
    return json(apiError('Internal server error'), { status: 500 });
  }
}
```

---

## Authentication & Authorization

```typescript
// 1. Authentication — who are you?
const session = await getSession(request);
if (!session) {
  return json(apiError('Authentication required'), { status: 401 });
}

// 2. Authorization — are you allowed to do this action?
if (!session.roles.includes('admin')) {
  return json(apiError('Insufficient permissions'), { status: 403 });
}

// 3. Ownership — does this resource belong to you?
const resource = await getResource(params.id);
if (!resource) {
  return json(apiError('Not found'), { status: 404 });
}
if (resource.userId !== session.userId) {
  // Return 403, not 404 — don't confirm the resource exists to unauthorized users
  // Exception: if the mere existence is also sensitive, return 404 consistently
  return json(apiError('Forbidden'), { status: 403 });
}
```

**Key rule:** Never return `404` to hide a resource from an unauthorized user unless the existence itself is sensitive. Returning `403` is more correct and clearer.

---

## Rate Limiting

All mutation endpoints (POST, PATCH, PUT, DELETE) should have rate limiting. Use platform-native solutions in production (Vercel Edge Config, Cloudflare Workers, Redis).

```typescript
// Minimal in-process approach for development / low-traffic APIs
const rateMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

// In route handler:
const clientIp = request.headers.get('x-forwarded-for') ?? 'unknown';
if (!checkRateLimit(clientIp)) {
  return json(apiError('Too many requests'), {
    status: 429,
    headers: { 'Retry-After': '60' },
  });
}
```

---

## CORS

For public APIs consumed by other origins:

```typescript
const ALLOWED_ORIGINS = ['https://yourdomain.com', 'https://app.yourdomain.com'];

export async function OPTIONS({ request }) {
  const origin = request.headers.get('origin') ?? '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

For internal APIs (same-domain SvelteKit routes), CORS is not needed.

---

## Security Checklist

Before shipping any API route:

- [ ] All user input validated with a schema library (Zod, Valibot, etc.)
- [ ] No raw DB errors, stack traces, or file paths in error responses
- [ ] Auth checked before any data access
- [ ] Ownership verified — user can only access their own resources
- [ ] Rate limiting on all mutation endpoints
- [ ] No sensitive data in responses (passwords, tokens, internal IDs not needed by client)
- [ ] CORS configured if cross-origin access is needed
- [ ] `Content-Type: application/json` set on all JSON responses
- [ ] Sensitive actions logged server-side (who, what, when) for audit trail

---

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| `200 { error: "..." }` | Client can't use status codes for control flow | Use correct 4xx/5xx |
| No input validation | Injection, mass assignment, data corruption | Validate with schema library before any logic |
| `err.message` in 500 responses | Leaks internals, aids attackers | Generic user message + server log |
| Inconsistent response shapes | Client parsing becomes brittle | Enforce envelope on every endpoint |
| Returning `404` to hide auth failures | Enumeration attacks — attackers learn what exists | Return `403` for unauthorized access |
| Giant handler function | Hard to test, error paths missed | Extract: parse → validate → auth → logic → response |
| No rate limiting on contact/auth routes | Spam, brute-force, DoS | Rate limit all mutations |
| Flat error object `{ error: string }` | Can't machine-handle error types | Add `code` field for client branching |
