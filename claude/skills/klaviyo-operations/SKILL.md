---
name: klaviyo-operations
description: Diagnose and safely operate Klaviyo profiles, events, metrics, flows, campaigns, templates, catalogs, consent, and Shopify-synced data. Use for Klaviyo account investigations and production-support questions; use klaviyo-product-recommendations for recommendation-specific failures.
---

# Klaviyo operations

Establish whether the user wants an explanation, a read-only investigation, or an approved change. Identify the Klaviyo account, customer/profile, time window, flow or campaign, message, and expected outcome before using account tools.

For changing features, API behavior, permissions, or limits, fetch current official Klaviyo documentation from `help.klaviyo.com` or `developers.klaviyo.com` before answering. Account data from the Klaviyo MCP is evidence about the account, not product documentation.

If the Klaviyo MCP is available, begin read-only. Ask it for exact IDs, names, timestamps, statuses, metric properties, and catalog records needed for the investigation. Do not infer a value that the tool did not return. When several client accounts are configured, confirm the intended account in the prompt and verify it with account details.

Read [references/diagnostic-ladder.md](references/diagnostic-ladder.md) for flow, event, profile, campaign, or delivery failures. For product feeds, recommendation blocks, or incorrect recommended items, use `klaviyo-product-recommendations` instead.

## Mutation boundary

Do not activate or pause flows, send or schedule campaigns, create synthetic customer events, change consent or suppression, add profiles to lists, edit segments, alter templates or catalogs, or delete resources unless the user explicitly authorizes that exact change. Before an approved write, state the account, affected resource IDs, expected blast radius, test path, and rollback.

Prefer draft or cloned resources and approved internal test profiles. After a change, verify the observable outcome without broadening the mutation.

## Result

Return:

- the observed symptom and expected behavior;
- evidence with resource IDs, names, timestamps, and source system;
- the first broken boundary in the data-to-message path;
- the smallest safe fix;
- what was verified and what remains unknown.
