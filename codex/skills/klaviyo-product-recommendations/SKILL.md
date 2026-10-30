---
name: klaviyo-product-recommendations
description: Diagnose incorrect, duplicated, missing, or irrelevant Klaviyo product recommendations across email Product blocks, product feeds, Next Best Product, Customer Hub, onsite recommendations, and Customer Agent. Use whenever a Klaviyo recommendation or recommended-product surface is failing.
---

# Klaviyo product recommendations

First identify the recommendation surface. These systems have different inputs, eligibility rules, previews, and fallback behavior:

1. a dynamic Product block backed by a Klaviyo product feed in a marketing email;
2. a Next Best Product block or catalog-insights recommendation;
3. Customer Hub or onsite product recommendations;
4. the Customer Agent Product Recommendations skill;
5. a custom event-driven template that only looks like a recommendation block.

Do not transfer a rule from one surface to another without current official documentation confirming it. Read [references/surface-diagnostics.md](references/surface-diagnostics.md) for the matching path.

Fetch current official Klaviyo documentation before relying on feature availability, plan requirements, training time, exclusion rules, or editor support. Start with:

- https://help.klaviyo.com/hc/en-us/articles/115005082787
- https://help.klaviyo.com/hc/en-us/sections/49375372745115
- https://help.klaviyo.com/hc/en-us/articles/26685770823451
- https://help.klaviyo.com/hc/en-us/articles/45769973148571

Use read-only Klaviyo MCP calls, when available, to inspect account details, catalog items and variants, events and metrics, profiles, flows, and templates. Cross-check every disputed product against Shopify for product/variant identity, publication, availability, inventory, image, category/collection, URL, and current status.

Do not change a feed, template, flow, catalog, profile, exclusion, or tracking configuration until the cause is demonstrated with a test profile and representative event. For an approved fix, prefer a draft or clone and preserve before/after evidence.

## Result

State the surface, affected profiles/messages, eligibility inputs, observed exclusion or fallback, first failing boundary, smallest safe correction, propagation delay that still needs observation, and exact validation performed.
