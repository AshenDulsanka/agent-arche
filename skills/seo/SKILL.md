---
name: seo
description: Implements and audits SEO for any website — technical foundation (sitemap, crawl, prerendering), metadata (title/description/OG/Twitter), structured data (JSON-LD), Core Web Vitals, on-page alignment, internal linking, and off-page authority signals. Use when building page metadata, adding schema markup, auditing search visibility, improving SERP CTR, or setting up a new site's SEO foundation.
argument-hint: "[page, feature, or site area to optimize]"
user-invocable: true
---

# SEO Skill

## Priority Order — Execute in This Sequence

Technical foundation must come first — unindexed pages can't rank regardless of quality.

| Phase | Focus | Why first |
|-------|-------|-----------|
| **1** | Crawl & index (sitemap, robots.txt, prerender) | Unblocks everything else |
| **2** | Metadata (title, description, canonical, OG/Twitter) | Controls SERP appearance |
| **3** | Structured data (JSON-LD) | Enables rich results |
| **4** | Core Web Vitals (LCP, INP, CLS) | Ranking signal + UX quality |
| **5** | On-page alignment (H1, headings, first paragraph) | Relevance signal |
| **6** | Internal linking | Authority distribution |
| **7** | Off-page (social signals, backlinks) | Domain authority |
| **8** | Monitoring & iteration | Compound gains |

---

## Phase 1: Crawl & Index

### Sitemap

Generate at build time — covers all important URLs including dynamic routes.

```typescript
// src/routes/sitemap.xml/+server.ts (SvelteKit example)
export const prerender = true;

export async function GET() {
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.9, changefreq: 'monthly' },
    { url: '/projects', priority: 0.9, changefreq: 'weekly' },
    { url: '/experience', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog', priority: 0.7, changefreq: 'daily' },
  ];

  // Dynamic entries
  projects.forEach((p) =>
    pages.push({ url: `/projects/${p.slug}`, priority: 0.8, changefreq: 'monthly' })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>https://yourdomain.com${p.url}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://yourdomain.com/sitemap.xml
```

Block `/api/` — API routes add no SEO value and waste crawl budget.

### Prerendering Dynamic Routes

Static HTML = faster indexing + no JavaScript execution required by the crawler.

```typescript
// src/routes/projects/[slug]/+page.ts
export const prerender = true;

export async function entries() {
  return projects.map((p) => ({ slug: p.slug }));
}
```

### Validation Checklist

- [ ] `/sitemap.xml` accessible in production; all important URLs present
- [ ] `robots.txt` has `Sitemap:` line pointing to full URL
- [ ] GSC → Coverage → "Indexed" count matches expected page count
- [ ] No important pages blocked by `noindex` or `Disallow`
- [ ] `site:yourdomain.com` in Google shows expected pages

---

## Phase 2: Metadata

### Centralized Metadata Component

One component used on every page — prevents inconsistency, reduces errors.

```svelte
<!-- SeoHead.svelte -->
<script lang="ts">
  interface Props {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    schema?: Record<string, unknown> | null;
    noindex?: boolean;
  }

  let {
    title,
    description,
    path = '',
    image = '/images/og-default.webp',
    type = 'website',
    schema = null,
    noindex = false,
  }: Props = $props();

  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://yourdomain.com';
  const pageUrl = `${siteUrl}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // CRITICAL: escape special chars to prevent template-syntax leakage and Rich Results errors
  const schemaJson = schema
    ? JSON.stringify(schema)
        .replace(/</g, '\\u003c')
        .replace(/-->/g, '--\\u003e')
    : null;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={pageUrl} />

  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content={imageUrl} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />

  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  {#if schemaJson}
    <svelte:element this={'script'} type="application/ld+json">
      {schemaJson}
    </svelte:element>
  {/if}
</svelte:head>
```

### Character Limits

| Element | Desktop max | Mobile max | Target range |
|---------|-------------|------------|--------------|
| `<title>` | 58–60 chars | 55 chars | **55–59 chars** |
| `<meta description>` | 155–160 chars | 120–130 chars | **148–155 chars** |

Google truncates by pixel width, not exact char count. Prioritize the first 120 chars of descriptions — mobile shows only ~85–120 chars.

### Title Formula

```
[Name or Brand] | [Primary Keyword] & [Secondary Keyword]
```

| Page | Good example | Length |
|------|-------------|--------|
| Home | `Your Name \| Security Researcher & Full-Stack Engineer` | 58 |
| About | `About Your Name \| Cybersecurity Engineer & Developer` | 54 |
| Projects | `Cybersecurity & Full-Stack Projects \| Your Name` | 49 |
| Blog post | `How I Built a Phishing Detection System \| Your Blog` | 53 |

### Description Formula

```
[Action verb] + [core value] + [proof point/specificity]
```

- Lead with primary intent
- First 120 chars must carry the message (mobile truncation point)
- Avoid generic filler ("This page contains...", "Welcome to...")

### What NOT to Do

- `meta keywords` tag — Google has ignored it since 2009
- Keyword stuffing — spam policy violation
- Duplicate canonicals across pages — every canonical must point to its own URL
- Generic H1s ("Welcome", "Home", "Page") that don't reinforce the title intent

---

## Phase 3: Structured Data (JSON-LD)

Prefer JSON-LD over Microdata — cleaner separation from HTML structure.

**Two mandatory rules before every schema:**

```javascript
// 1. Always escape special characters
const schemaJson = JSON.stringify(schema)
  .replace(/</g, '\\u003c')
  .replace(/-->/g, '--\\u003e');

// 2. Always filter before mapping to prevent empty-field parser errors
items.filter((item) => Boolean(item.name?.trim())).map(...)
```

### Recipe 1: Person + SameAs (global layout — inject once)

```javascript
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "jobTitle": "Your Role",
  "url": "https://yourdomain.com",
  "image": "https://yourdomain.com/images/profile.webp",
  "description": "Short bio",
  "sameAs": [
    "https://github.com/yourusername",
    "https://linkedin.com/in/yourusername",
    "https://twitter.com/yourusername"
  ]
}
```

Also add `rel="me noopener noreferrer"` to the same social links in HTML — reinforces entity consolidation in Google's Knowledge Graph.

### Recipe 2: ProfilePage (about page)

```javascript
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "name": "About Your Name",
  "url": "https://yourdomain.com/about",
  "description": "Page description",
  "mainEntity": {
    "@type": "Person",
    "name": "Your Name",
    "jobTitle": "Your Role",
    "image": "https://yourdomain.com/images/profile.webp",
    "description": "Bio text"
  }
}
```

### Recipe 3: ItemList (listing pages — projects, experience)

```javascript
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Your Projects",
  "url": "https://yourdomain.com/projects",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.title,
    "description": item.shortDescription,
    "url": `https://yourdomain.com/projects/${item.slug}`
  }))
}
```

### Recipe 4: BreadcrumbList (all detail pages)

```javascript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourdomain.com" },
    { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://yourdomain.com/projects" },
    { "@type": "ListItem", "position": 3, "name": projectTitle, "item": `https://yourdomain.com/projects/${slug}` }
  ]
}
```

### Recipe 5: BlogPosting (blog posts)

```javascript
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description,
  "url": `https://yourdomain.com/blog/${post.slug}`,
  "datePublished": post.date,
  "dateModified": post.updatedAt ?? post.date,
  "author": {
    "@type": "Person",
    "name": "Your Name",
    "url": "https://yourdomain.com"
  },
  "image": post.image ? `https://yourdomain.com${post.image}` : undefined
}
```

### Recipe 6: CollectionPage + EducationalOccupationalCredential (certifications)

```javascript
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AWS Certifications",
  "url": "https://yourdomain.com/about/certifications/aws",
  "hasPart": certifications
    .filter((c) => Boolean(c.name?.trim()))
    .map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "credentialCategory": "Certificate",
      "recognizedBy": { "@type": "Organization", "name": cert.issuer },
      "url": cert.credentialUrl
    }))
}
```

### Validation

- Run each page URL through [Google Rich Results Test](https://search.google.com/test/rich-results)
- Check GSC → Enhancements → look for "Invalid items" warnings

---

## Phase 4: Core Web Vitals

### Thresholds (measure at 75th percentile of page loads)

| Metric | Good | Needs work | Poor |
|--------|------|------------|------|
| **LCP** — Largest Contentful Paint | ≤ 2.5s | 2.5s–4.0s | > 4.0s |
| **INP** — Interaction to Next Paint | ≤ 200ms | 200ms–500ms | > 500ms |
| **CLS** — Cumulative Layout Shift | ≤ 0.1 | 0.1–0.25 | > 0.25 |

FID was retired in 2024; INP replaced it as the interactivity metric.

### Common Causes & Fixes

**LCP degraders:**
- Large unoptimized images → use WebP/AVIF, add `fetchpriority="high"` on the LCP element
- Render-blocking scripts/CSS → defer non-critical scripts
- Slow TTFB → optimize server response time or use prerendering/SSG

**INP degraders:**
- Long JS tasks blocking the main thread → break up heavy handlers, use `requestIdleCallback`
- Heavy event handlers on inputs/clicks → debounce expensive operations

**CLS degraders:**
- Images/embeds without explicit dimensions → always set `width` + `height`
- Late-injected banners → reserve space with CSS `min-height` before content loads
- Web font layout shifts → use `font-display: swap`

### Quick Wins

```html
<!-- LCP image: eager + high priority, explicit dimensions -->
<img src="hero.webp" alt="..." width="1200" height="630"
     loading="eager" fetchpriority="high" />

<!-- All other images: lazy, always with dimensions -->
<img src="project.webp" alt="..." width="800" height="450" loading="lazy" />
```

```css
/* Prevent CLS from font loading */
@font-face {
  font-display: swap;
}
```

### Measurement Tools

- **Lighthouse** (Chrome DevTools) — lab measurement during development
- **PageSpeed Insights** (pagespeed.web.dev) — lab + real-user field data
- **GSC → Core Web Vitals report** — actual user field data segmented by URL

---

## Phase 5: On-Page Alignment

### H1 Alignment Rule

The H1 must closely echo the `<title>`. Google uses both to understand page topic.

```
Title: "Your Name | Security Researcher & Full-Stack Engineer"
H1:   "Security Researcher & Full-Stack Engineer"
```

Not: "Welcome to my site" or "Hi there" or a decorative tagline unrelated to the title.

### Heading Hierarchy

- **One H1 per page** — the page topic
- **H2s** for major sections
- **H3s** for subsections within an H2
- Never skip levels (H1 → H3 is wrong)
- No H-tags used for visual styling — use CSS classes instead

### First Paragraph Optimization

Google extracts the first ~100–150 characters of body copy for rich snippets.

```html
<h1>About Your Name</h1>
<p>
  Security researcher focused on penetration testing and application security,
  with expertise in full-stack SaaS development and modern cloud platforms.
</p>
<!-- Long-form bio follows -->
```

The first paragraph must:
- Reinforce the H1 topic
- State the primary keyword naturally
- Answer "what will I find on this page?"

---

## Phase 6: Internal Linking

### Pattern

Connect detail pages to related detail pages — distributes authority and improves crawl depth.

```typescript
// Utility: find related items by shared tags/technologies
export function getRelated<T extends { slug: string; technologies: string[] }>(
  currentSlug: string,
  allItems: T[],
  limit = 3
): T[] {
  const current = allItems.find((i) => i.slug === currentSlug);
  if (!current) return [];

  return allItems
    .filter((item) => item.slug !== currentSlug)
    .map((item) => ({
      item,
      overlap: item.technologies.filter((t) =>
        current.technologies.map((x) => x.toLowerCase()).includes(t.toLowerCase())
      ).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ item }) => item);
}
```

### Rules

- Add 2–3 related content links at the bottom of every detail page
- Use **descriptive anchor text** ("Phishing Detection Project" not "click here")
- Add breadcrumb navigation on all detail pages (and breadcrumb schema)
- Internal links use relative paths — never `rel="nofollow"` on your own site

---

## Phase 7: Off-Page Basics

### Social Signal Standardization

Consistent identity across platforms strengthens entity recognition in Google's Knowledge Graph.

**Every public profile must have:**
- Same full name (no nicknames)
- Same role/headline using your primary keywords
- Link back to your primary domain
- `rel="me noopener noreferrer"` on outbound social links from your site

Platforms: GitHub, LinkedIn, X/Twitter, YouTube, Dev.to, any publications.

### Backlink Strategy

One high-quality backlink beats twenty weak ones.

**Backlink-ready assets (create one):**
- Detailed project case study with architecture, metrics, and lessons
- Original research or tool comparison
- Open-source tool with real documentation

**Outreach targets:**
- Relevant communities (Discord servers, Reddit, niche forums)
- Dev directories (Dev.to, HackerNews Show HN)
- Guest posts on domain authority > 20 niche sites (cybersecurity, dev, SaaS)

**Quality bar:** Relevant niche + DA > 10 + no spam indicators.

---

## Phase 8: Monitoring

### Weekly Checklist (30 min)

In Google Search Console:
1. Impressions ↑ — visibility growing?
2. Clicks ↑ — CTR improvements landing?
3. CTR by page — any page < 1.5%? → rewrite title/description
4. Average position — any page at 11–15? → internal link boost candidate
5. Coverage errors — new "Excluded" or "Error" pages?

### Response Guide

| Signal | Action |
|--------|--------|
| Impressions ↓ | Check for noindex tags, robots.txt issues, server errors |
| CTR ↓ on a page | Rewrite title/description — try more specific variant |
| Avg position degraded | Content refresh + add internal links from higher-ranking pages |
| CWV regression | Run PageSpeed Insights → isolate regression → fix before next deploy |

### Monthly Optimization Cycle

1. Audit pages in GSC top 100 with CTR < 2%
2. Rewrite titles/descriptions for underperformers
3. Add internal links from high-ranking pages to underperformers
4. Refresh content with stale dates or outdated data
5. Measure after 2 weeks

---

## Common Pitfalls

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Template syntax in JSON-LD | Unescaped `<` in rendered HTML | `.replace(/</g, '\\u003c')` |
| Duplicate canonicals | Copy-paste errors | Each page self-canonicals to its own URL |
| Description truncated on mobile | Key info after 120 chars | Front-load the message in first 120 chars |
| H1 mismatches title | Forgot to sync after title change | H1 must echo or closely match `<title>` |
| Empty schema fields | No filter before `.map()` | `filter(item => Boolean(item.name?.trim()))` |
| CLS from images | No explicit dimensions | Always add `width` + `height` to `<img>` |
| API routes getting indexed | Missing `Disallow` in robots.txt | `Disallow: /api/` |
| Meta keywords tag | Old habit | Remove — Google ignores it since 2009 |

---

## Validation Tools

| Tool | Use |
|------|-----|
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Validate JSON-LD schema |
| [PageSpeed Insights](https://pagespeed.web.dev) | Core Web Vitals (field + lab) |
| [Google Search Console](https://search.google.com/search-console) | Indexing, clicks, impressions, CTR |
| [SERP Simulator — Sistrix](https://app.sistrix.com/serp-simulator) | Preview title/description in SERP |
| Lighthouse (Chrome DevTools) | Local CWV audit during development |
| `site:yourdomain.com` in Google | Quick index check |

---

## Portfolio-Specific Patterns

### Dual keyword strategy

Target both branded queries (`[your name]`) and role queries (`security researcher portfolio`, `full-stack security engineer`). Spread naturally across Home, About, Projects, Experience — never concentrate all keywords on one page.

### Project pages as conversion funnels

Each project detail page:
- Rich description + `ItemList` + `BreadcrumbList` schema
- Link to GitHub / live demo
- Related experience links (internal linking — share authority)
- CTA toward contact or LinkedIn

### Certifications as trust signals

Create `/about/certifications/[provider]` detail pages with `CollectionPage` + `EducationalOccupationalCredential` schema. Reference certifications in experience descriptions for natural keyword reinforcement.

### Blog as discovery gateway

- Link **from** portfolio detail pages **to** related blog posts
- Link **from** blog posts **back to** portfolio projects
- Portfolio = proof; blog = discovery and long-tail keyword capture
