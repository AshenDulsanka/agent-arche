---
name: security-review
description: Threat-model, test, and review security-sensitive code changes. Use for authentication, authorization, sessions, secrets, untrusted input, API routes, SQL, file access, uploads, redirects, SSRF-prone outbound requests, serialization, cryptography, payments, or sensitive data; also use when the user requests an OWASP or vulnerability audit. Do not trigger for unrelated code merely because security is generally important.
---

# Security Review

Use OWASP categories as coverage prompts, not as a context-free checklist. Review only unless the user asks for fixes.

## 1. Scope the trust boundary

Identify the protected assets, actors, entry points, trust boundaries, data flow, and attacker-controlled inputs. Read the changed code plus authentication middleware, authorization checks, validators, persistence boundaries, configuration, callers, and tests that determine the real behavior.

If the request is diff-based, pin the same review range as `code-review`. If it is a broader audit, agree or infer a bounded subsystem; do not imply the whole application was audited when only a slice was inspected.

## 2. Map relevant threats

Select only applicable checks from:

- broken access control, tenant isolation, IDOR, privilege escalation, and unsafe defaults;
- authentication, session, token, password-reset, MFA, and account-recovery failures;
- injection in SQL, commands, templates, headers, logs, and client-rendered content;
- SSRF, unsafe redirects, path traversal, uploads, archive extraction, and file disclosure;
- cryptographic failures, secret exposure, sensitive logging, and data retention;
- insecure deserialization, parser abuse, mass assignment, and integrity failures;
- security misconfiguration, permissive CORS, missing browser controls, debug exposure, and dependency risk;
- abuse resistance: rate limits, replay, race conditions, resource exhaustion, and business-logic bypass;
- insufficient security logging and alerting.

Record why each selected threat is applicable. Mark skipped categories as out of scope only when that improves clarity.

## 3. Test with evidence

Prefer the narrowest safe proof:

1. Existing security or integration tests.
2. A focused regression test at the public boundary.
3. Static analysis, dependency audit, secret scan, or framework security check already available in the repo.
4. A local request or browser harness using synthetic data and non-destructive payloads.
5. Manual data-flow review when execution is unavailable.

Test both allowed and denied cases. For authorization, vary identity, role, tenant, resource owner, and object identifier. For input attacks, verify the sink and encoding/parameterization rather than spraying generic payloads. Never test production or third-party systems without explicit authorization.

## 4. Report

Each finding must include:

- severity (`critical`, `high`, `medium`, `low`) and confidence;
- affected file/line or endpoint;
- attack preconditions and plausible impact;
- evidence or reproduction steps;
- the smallest effective remediation;
- a regression test recommendation.

Separate confirmed vulnerabilities from defense-in-depth suggestions. Include the scoped surfaces, tools/checks actually run, results, and untested areas. A clean review means “no findings in this scope,” never “secure.”

When fixes are authorized, route implementation through `implement`, add a failing regression test where possible, and re-run the exact security proof after the fix.
