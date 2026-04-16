---
name: typeset
description: "Diagnoses and fixes typography — font choices, type hierarchy, readability, scale, and consistency. Use when text feels hard to read, the hierarchy is unclear, or fonts feel generic or clashing."
argument-hint: "[target]"
user-invocable: true
---

Fix typographic problems to create text that is beautiful, readable, and hierarchically clear.

## Mandatory Preparation

Read `.github/skills/impeccable/SKILL.md` and `reference/typography.md` for the typography reference.

## Assess Typography Problems

Check current state:

**Font Choices**:
- Are fonts invisible defaults (system-ui, sans-serif with no personality)?
- Do multiple fonts clash in weight, style, or character?
- Do fonts match the brand personality?
- Are fonts loaded efficiently?

**Hierarchy**:
- Are heading sizes too close together (barely distinguishable)?
- Is there more than one H1-equivalent? (There should be exactly one per page)
- Can you identify body text, labels, captions, and headings at a glance?
- Does weight differentiation reinforce hierarchy meaningfully?

**Size & Scale**:
- Are sizes from a modular scale, or arbitrary (13px, 17px, 21px)?
- Is body text readable (16px minimum, ideally 16–18px)?
- Is there too little size variation (all text feels same size)?

**Readability**:
- Is line length too long (over 75 characters)?
- Is line height too tight (anything below 1.4 for body text)?
- Are paragraphs too long (over 7 lines without a break)?
- Is font weight too light for small sizes?

**Consistency**:
- Do similar elements always use the same type style?
- Are there one-off sizes that don't follow the scale?
- Are semantic type roles defined (body, caption, label, heading)?

## Plan Typography Improvements

Define strategy before changing anything:

1. **Font selection**: What personality does the product need?
2. **Type scale**: 5 sizes from a modular ratio
3. **Weight strategy**: Which weights to load, what roles they play
4. **Spacing**: Line height, letter spacing, paragraph spacing

## Improve Typography

### Font Selection

Match font personality to brand:

**Brand personality → Font direction**:
- Professional / Corporate → Clean sans-serif (Inter, IBM Plex Sans)
- Human / Approachable → Rounded sans-serif (Nunito, DM Sans)
- Editorial / Authoritative → Serif (Playfair Display, Lora, Georgia)
- Technical / Developer → Geometric mono (JetBrains Mono, Fira Code)
- Creative / Expressive → Distinct character (Clash Display, Cabinet Grotesk)

**Pairing principles**:
- High contrast pair: Serif heading + sans-serif body
- Harmonious pair: Same family, different weights
- Avoid: Two display fonts, fonts with similar character shapes
- Maximum two font families (heading + body), three only if justified

**Load efficiently**:
```css
/* Only load weights you'll actually use */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* subset if only using Latin characters */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0020-007F; /* Basic Latin */
}
```

### Type Scale

Use a modular scale — 5 sizes, 1.25 minimum ratio:

```css
/* Modular scale (ratio: 1.25 — Major Third) */
--text-xs:   0.64rem;  /* 10.2px — metadata, fine print */
--text-sm:   0.8rem;   /* 12.8px — captions, labels */
--text-base: 1rem;     /* 16px   — body text */
--text-lg:   1.25rem;  /* 20px   — large body, lead text */
--text-xl:   1.563rem; /* 25px   — component heading */
--text-2xl:  1.953rem; /* 31px   — section heading */
--text-3xl:  2.441rem; /* 39px   — page heading */
--text-4xl:  3.052rem; /* 49px   — hero heading */

/* Application vs. Marketing */
/* Apps: Fixed rem sizes (predictable, reliable) */
/* Marketing: clamp() for fluid scaling */
--heading-hero: clamp(2rem, 5vw + 1rem, 4rem);
```

**Semantic tokens** (name by role, not size):
```css
--font-size-body: var(--text-base);
--font-size-body-sm: var(--text-sm);
--font-size-label: var(--text-xs);
--font-size-caption: var(--text-sm);
--font-size-heading-section: var(--text-2xl);
--font-size-heading-page: var(--text-3xl);
--font-size-display: var(--text-4xl);
```

### Readability

**Line length**:
```css
/* Comfortable reading range: 45-75 characters */
.prose, .body-text, article {
  max-width: 65ch; /* ch = width of '0' character */
}

/* Don't constrain short UI text */
.label, .button, .nav-item {
  max-width: none;
}
```

**Line height**:
```css
/* Headings: tight (they're short) */
h1, h2, h3 {
  line-height: 1.1;
  letter-spacing: -0.02em; /* Tighten at large sizes */
}

/* Body text: comfortable */
p, li {
  line-height: 1.6;
}

/* Labels and UI text: slightly tighter */
.label, .caption {
  line-height: 1.4;
}

/* Compact UI components */
.button, .badge {
  line-height: 1.2;
}
```

**Don't over-thin**:
```css
/* ✅ Good: weight matches size */
.body { font-weight: 400; font-size: 1rem; }
.caption { font-weight: 500; font-size: 0.8rem; } /* Heavier at small size */

/* ❌ Bad: thin weight at tiny size */
.metadata { font-weight: 300; font-size: 0.75rem; }
```

### Spacing

```css
/* Paragraph spacing: 1em is standard */
p + p {
  margin-top: 1em;
}

/* Letter spacing: only for uppercase labels, never body text */
.label--uppercase {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Numbers: tabular-nums for alignment */
.price, .stat, .count {
  font-variant-numeric: tabular-nums;
}
```

### Fix Common Violations

**Heading sizes too similar**:
```css
/* ❌ Bad: barely distinguishable */
h2 { font-size: 1.2rem; }
h3 { font-size: 1.1rem; }
h4 { font-size: 1rem; }

/* ✅ Good: clear stepping */
h2 { font-size: 1.875rem; }
h3 { font-size: 1.25rem; }
h4 { font-size: 1rem; font-weight: 600; } /* Weight, not size */
```

**Turn off kerning for large text**:
```css
h1, h2 {
  font-kerning: normal; /* Improves glyph spacing at display sizes */
}
```

## Verify Typography Quality

- **Hierarchy**: Can you identify heading levels H1/H2/H3 in under 2 seconds?
- **Readability**: Body text at 16px+, line height 1.5–1.7, max 65ch width
- **Consistency**: Similar content uses identical type styles throughout
- **Personality**: Fonts match brand character; not invisible defaults
- **Performance**: Only loading weights actually used; `font-display: swap`
- **Accessibility**: 4.5:1 contrast ratio for body text, 3:1 for large text

**NEVER**:
- Use more than 2 font families without strong justification
- Set body text below 16px
- Use `font-weight: 300` for small text
- Mix many arbitrary sizes (always use a scale)
- Forget to check readability on mobile (smaller viewport, same font size)
- Use all-caps for body text (readability killer)
- Letter-space body text (only for uppercase labels/small caps)
