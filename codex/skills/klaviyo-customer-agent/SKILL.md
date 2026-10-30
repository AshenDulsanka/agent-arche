---
name: klaviyo-customer-agent
description: Configure, test, and troubleshoot Klaviyo Customer Agent skills, tools, Guidance, prerequisites, routing, channel behavior, and escalations. Use for Klaviyo's shopper-facing Customer Agent; do not use for Codex SKILL.md authoring or ordinary marketing email product blocks.
---

# Klaviyo Customer Agent

Keep the terminology explicit: a Klaviyo Customer Agent skill is a shopper-facing capability inside Klaviyo. It is not a portable Codex `SKILL.md` package.

Before changing anything, fetch the current official Klaviyo pages because built-in skills, beta status, prerequisites, editable fields, channels, and APIs change frequently:

- Understanding Skills: https://help.klaviyo.com/hc/en-us/articles/45769973148571
- Create a Skill: https://help.klaviyo.com/hc/en-us/articles/49761932711067
- Customer Agent APIs: https://help.klaviyo.com/hc/en-us/articles/50972372091163

## Investigate

1. Identify the shopper request, channel, expected skill, actual response, and escalation outcome.
2. Confirm that the prerequisite integration and permissions for the intended built-in skill are present.
3. Determine whether routing selected the intended skill. Separate routing failure from tool failure, missing content, bad instructions, unavailable data, and channel formatting.
4. Inspect the skill's instructions, tools, content scope, global Guidance, escalation rules, and relevant recent conversations.
5. Reproduce in the playground with a controlled shopper/profile and the same channel context where possible.

Product Recommendations in Customer Agent depends on Shopify and is distinct from marketing email product feeds. Use `klaviyo-product-recommendations` when the complaint concerns the products themselves or another recommendation surface.

## Create or revise a custom Customer Agent skill

Define one narrow shopper intent. Write a discriminating "when to use" rule, a response procedure, required tool inputs, safe failure behavior, and human-handoff conditions. Attach only the tools and content the workflow needs. Test positive routing, near-miss routing, missing data, tool failure, malicious or irrelevant shopper text, and escalation before enabling it.

Do not enable a live skill, change global Guidance, attach a write-capable custom tool, or alter escalation behavior without explicit approval and a rollback path. Treat Customer Agent APIs marked beta as unstable and confirm their current schema before implementation.

## Result

Return the expected and actual router choice, prerequisites, tool/content evidence, reproduction, proposed instruction or configuration change, playground results, rollout/rollback plan, and remaining uncertainty.
