# SEO growth and monitoring

## Contents

- [Off-page basics](#off-page-basics)
- [Monitoring](#monitoring)
- [Common pitfalls](#common-pitfalls)
- [Validation tools](#validation-tools)
- [Portfolio-specific patterns](#portfolio-specific-patterns)

## Off-page basics

### Social signal standardization

Keep the same full name, role/headline, primary-domain link, and public identity across relevant profiles. Use `rel="me noopener noreferrer"` on outbound social links from the site.

### Backlink strategy

Prefer a small number of relevant, credible links over bulk outreach. Useful linkable assets include detailed project case studies, original research or comparisons, and documented open-source tools. Check topical relevance and spam signals directly rather than treating third-party authority scores as truth.

## Monitoring

### Weekly checks

In Google Search Console, review impressions, clicks, CTR by page, average position, and new indexing errors. Investigate changes against deployments, crawl rules, content updates, and Core Web Vitals before choosing a fix.

### Response guide

| Signal | Action |
|---|---|
| Impressions fall | Check `noindex`, robots rules, canonicals, server errors, and demand changes |
| Page CTR falls | Compare the query mix, then test a more specific title and description |
| Average position falls | Refresh stale content and inspect internal-link and competitor changes |
| Core Web Vitals regress | Measure the affected template and isolate the deployment regression |

Review longer-term trends monthly. Measure a material change long enough to account for crawl and reporting delay before attributing results.

## Common pitfalls

| Pitfall | Cause | Fix |
|---|---|---|
| Template syntax in JSON-LD | Unsafe serialized markup | Escape `<` when embedding JSON in HTML |
| Duplicate canonicals | Shared or copied metadata | Give every indexable page the correct canonical |
| H1 and title diverge | Metadata changes without page review | Keep their subject and intent aligned |
| Empty schema fields | Unvalidated source data | Filter and validate before serialization |
| CLS from images | Missing dimensions | Provide intrinsic width and height |
| API routes indexed | Missing crawl controls | Prevent discovery and return appropriate indexing signals |
| Meta keywords | Obsolete implementation | Remove the tag |

## Validation tools

| Tool | Use |
|---|---|
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Validate supported structured data |
| [PageSpeed Insights](https://pagespeed.web.dev) | Inspect field and lab performance |
| [Google Search Console](https://search.google.com/search-console) | Review indexing and search performance |
| Lighthouse | Run local performance and SEO checks |
| `site:example.com` search | Perform a rough discovery check, not a complete index count |

## Portfolio-specific patterns

- Target branded and role queries naturally across the appropriate pages.
- Make project pages useful case studies with evidence, relevant schema, source/demo links, and related internal links.
- Present certifications as verifiable trust signals without overstating what they prove.
- Link portfolio proof to related explanatory articles and back again when the relationship helps the reader.
