---
name: commerce-integration-debugging
description: Trace customer, catalog, order, event, webhook, and recommendation failures across Shopify, Klaviyo, and a Django backend. Use when the symptom crosses systems or its owner is unclear; use a narrower domain skill once the first broken boundary is known.
---

# Commerce integration debugging

Build one evidence chain for one affected customer or product. Do not debug all systems independently without shared identifiers.

Use this path:

`Shopify action/catalog -> integration or webhook -> Django receipt/persistence/job -> Klaviyo profile/event/catalog -> flow/filter/template -> customer-visible result`

At each boundary record the source ID, destination ID, timestamp with timezone, payload fields used for correlation, expected transformation, observed transformation, retry/deduplication state, and evidence source. Identify the first boundary where expected and observed diverge, then hand the fix to the narrowest relevant skill.

## Required distinctions

- Profile identity is not the same as consent, list membership, or deliverability.
- Shopify product IDs, variant IDs, SKUs, and Klaviyo catalog IDs may have different formats; record mappings rather than comparing labels.
- Shopify webhooks can be duplicated, delayed, missed, or delivered out of order. Verify HMAC from the raw body, deduplicate with persistent delivery identity, process idempotently, acknowledge quickly, and reconcile periodically.
- A Klaviyo flow can receive an event while still excluding a profile through filters, timing, status, or consent.
- A rendered recommendation can be wrong even when the source event is correct; identify the exact recommendation surface.

Use current official sources for volatile behavior:

- Shopify webhooks: https://shopify.dev/docs/apps/build/webhooks
- Shopify delivery verification: https://shopify.dev/docs/apps/build/webhooks/verify-deliveries
- Klaviyo Shopify data: https://help.klaviyo.com/hc/en-us/articles/115005080447
- Klaviyo Events API: https://developers.klaviyo.com/en/reference/events_api_overview
- Django documentation for the project's installed version: https://docs.djangoproject.com/

Start external systems read-only. Do not replay production webhooks, synthesize production events, alter consent, backfill records, or change a live flow/integration while diagnosing. Use an approved test customer, test store, fixture, or captured redacted payload.

Return a compact boundary table, the first failing boundary, owner, smallest safe fix, replay/reconciliation implications, validation, and remaining unknowns.
