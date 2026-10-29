---
name: django-commerce-backend
description: Build and debug Django services that integrate with Shopify and Klaviyo APIs, OAuth, events, catalogs, and webhooks. Use for Django code, persistence, background jobs, reconciliation, or tests in this commerce stack; do not expose the application through a Django MCP package unless explicitly requested.
---

# Django commerce backend

Inspect the repository before choosing patterns: pinned Python and Django versions, settings layout, installed apps, API framework, database, task runner, deployment model, and existing Shopify/Klaviyo clients. Use documentation for the installed version. Do not upgrade to the newest Django release as part of an unrelated integration fix.

Django does not currently publish an official MCP server or official portable agent-skill bundle. Use current official Django documentation through web search or the configured documentation MCP. Treat community packages that expose models, admin actions, or DRF views as a separate security-sensitive product decision, not default tooling.

## Integration boundaries

- Keep provider clients behind a small service interface and centralize authentication, API revision/version, timeouts, pagination, rate-limit handling, and error translation.
- Never expose Klaviyo private keys, Shopify access tokens, webhook secrets, or customer data to browser code or logs.
- Validate inbound authenticity before parsing or acting on a webhook. Shopify HMAC verification requires the raw request body and constant-time comparison.
- Persist provider delivery/event identity and processing state. Make handlers idempotent and tolerant of duplicate and out-of-order delivery.
- Return success quickly after durable receipt; move slow provider calls and business processing to the project's existing task mechanism.
- When a task depends on committed database state, enqueue it with `transaction.on_commit`.
- Add reconciliation for missed or failed deliveries rather than assuming webhooks are a complete event log.
- Prefer explicit service calls over Django signals for core integration behavior; signals can hide control flow and complicate retry behavior.

## Tests

Cover valid and invalid signatures, raw-body handling, replayed delivery IDs, duplicate business events, out-of-order updates, transaction rollback, task retry, provider timeouts/rate limits, partial failure, stale-event rejection or merge behavior, reconciliation, and redaction of secrets/PII.

Use official sources at execution time:

- Django docs: https://docs.djangoproject.com/
- Django transactions: https://docs.djangoproject.com/en/stable/topics/db/transactions/
- Django deployment checklist: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/
- Shopify webhooks: https://shopify.dev/docs/apps/build/webhooks
- Klaviyo API authentication: https://developers.klaviyo.com/en/docs/authenticate_

Return the inspected version assumptions, boundary design, files changed, migration/operational impact, tests run, and any live-system validation still required.
