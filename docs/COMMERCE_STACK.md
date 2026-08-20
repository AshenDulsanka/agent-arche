# Commerce Stack

Commerce Stack is the Shopify + Klaviyo + Django setup profile. It changes skill recommendations and, for hook-enabled scopes, installs project-scoped MCP configuration. It does not replace the four installation scopes.

## Scope behavior

| Scope | Commerce skills | MCP config | Commerce agents |
|---|---:|---:|---:|
| Skills only | Yes | No | No |
| Skills + hooks | Yes | Yes | No |
| Skills + hooks + memory | Yes | Yes | No |
| Full orchestration | Yes | Yes | Yes |

## MCP sources and posture

### Klaviyo

Agent Arche uses Klaviyo's official remote MCP:

```toml
[mcp_servers.klaviyo]
url = "https://mcp.klaviyo.com/mcp?read-only=true&core-tools-only=true"
```

Authenticate with `codex mcp login klaviyo`. The account must meet Klaviyo's current role requirements. The installed URL disables write tools and limits the initial tool set. Review the account and requested permissions during OAuth.

If a required read-only catalog, event, profile, flow, or template tool is not in the core set, remove only `core-tools-only=true` after reviewing the expanded tools. Keep `read-only=true` until a specific write is approved.

Official source: https://developers.klaviyo.com/en/docs/klaviyo_mcp_server

### Shopify

Agent Arche uses Shopify's official local Dev MCP:

```toml
[mcp_servers.shopify-dev-mcp]
command = "npx"
args = ["-y", "@shopify/dev-mcp@latest"]
```

It provides current Shopify developer documentation, schemas, and validation. Store operations remain subject to Shopify CLI authentication and the explicit mutation boundary in the skills.

Official source: https://shopify.dev/docs/apps/build/ai-toolkit

### Django

The Django Software Foundation does not currently publish an official Django MCP server or portable agent-skill bundle. The Commerce profile enables Context7 for current documentation lookup but does not expose a Django application's data.

Community packages that add MCP endpoints to Django have materially different authentication, permission, transport, session, and data-exposure behavior. Select and threat-model one only when a real project requires agent access to application data.

Official documentation: https://docs.djangoproject.com/

## Skills

### Agent Arche-authored

- `klaviyo-operations`
- `klaviyo-product-recommendations`
- `klaviyo-customer-agent`
- `commerce-integration-debugging`
- `django-commerce-backend`

The Klaviyo Customer Agent documentation supplied during design describes Klaviyo's own shopper-facing skill system. It is an authoritative source for `klaviyo-customer-agent`, but it is not a portable Codex skill package:

https://help.klaviyo.com/hc/en-us/articles/45769973148571

### Official Shopify AI Toolkit snapshot

The following skills are vendored from Shopify AI Toolkit v1.7.0 at commit `51a7d6cbed88fec14658f4e2d243dcdab128cf77`; their skill metadata reports version 1.12.4:

- `shopify-admin`
- `shopify-liquid`
- `shopify-custom-data`
- `shopify-use-shopify-cli`
- `shopify-dev`

The upstream project is MIT licensed. Agent Arche removes only the upstream cross-agent `compatibility` and `hooks` frontmatter keys because the Codex skill validator rejects them; instructions, scripts, assets, metadata, and telemetry notices remain. The scripts disclose usage telemetry to Shopify, including queries or validation data depending on the script. Set `OPT_OUT_INSTRUMENTATION=true` to opt out. Vendored copies do not auto-update; refresh them deliberately from the official repository and re-run validation.

Sources:

- https://github.com/Shopify/shopify-ai-toolkit
- https://shopify.dev/docs/apps/build/ai-toolkit

## Operational safety

Start customer/account investigations read-only. Before a live write, identify the account and resource IDs, use an approved test profile or store, state the expected blast radius, and prepare rollback. Never activate or pause flows, send campaigns, alter consent, back-populate events, replay production webhooks, publish themes, or expose Django models through MCP merely because the tooling can do so.

Research for this profile was refreshed on 2026-08-20. The installed skills require checking current official documentation at execution time for versions, permissions, limits, beta features, and product behavior.
