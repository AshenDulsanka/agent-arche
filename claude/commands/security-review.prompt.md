---
description: Review the selected code for security vulnerabilities. Covers the OWASP Top 10 — broken access control, injection, XSS, hardcoded secrets, security misconfiguration, insecure design, authentication failures, integrity failures, logging gaps, and SSRF.
---

Review the following source code for security vulnerabilities.

## What to Check

Run through each of these OWASP Top 10 categories:

### A01 — Broken Access Control
- Can users access resources they should not (IDOR, path traversal, privilege escalation)?
- Do all file system operations validate that the resolved path stays within the intended directory?
- Are there any directory traversal possibilities with `../` or URL-encoded variants?

### A02 — Cryptographic Failures
- Are there API keys, tokens, passwords, or secrets hardcoded in source files?
- Is sensitive data (PII, credentials, tokens) logged or returned in API responses?
- Is data transmitted over unencrypted channels when encryption is required?

### A03 — Injection
- Are all SQL/database queries using parameterised statements (never string interpolation)?
- Is user input ever passed to `eval`, `Function()`, `child_process.exec`, or shell commands?
- Are template literals or string concatenation used to build queries or commands?

### A04 — Insecure Design
- Are there missing rate limits on authentication or sensitive API endpoints?
- Is there server-side validaton for all inputs (not just client-side)?
- Are there any assumptions that client-supplied data can be trusted?

### A05 — Security Misconfiguration
- Do error handlers expose stack traces, internal paths, or DB schema to the client?
- Are there any `.env` values being returned in API responses?
- Are default credentials or example secrets present in config files?

### A06 — Vulnerable and Outdated Components
- Are any direct dependencies known to have published CVEs?
- Are dependencies pinned to versions with known vulnerabilities?

### A07 — Identification and Authentication Failures
- Are session tokens validated on every request?
- Are passwords hashed with a strong, modern algorithm (bcrypt, argon2)?
- Is there protection against brute-force on authentication endpoints?

### A08 — Software and Data Integrity Failures
- Is user-controlled content rendered as HTML without sanitisation (`{@html ...}` in Svelte)?
- If so, is it sanitised with DOMPurify or equivalent before rendering?

### A09 — Security Logging and Monitoring Failures
- Are authentication failures, access control violations, and input validation errors logged?
- Is sensitive data redacted from logs?

### A10 — Server-Side Request Forgery (SSRF)
- Does any code fetch URLs based on user input without validating the target?
- Are outbound HTTP requests restricted to an allow-list of domains?

## Output Format

For each finding:
1. **Severity**: Critical / High / Medium / Low
2. **Category**: OWASP category name
3. **Location**: File path and approximate line number
4. **Problem**: What the vulnerability is
5. **Fix**: Concrete code change to remediate it

If no vulnerabilities are found in a category, mark it as "Clear".
