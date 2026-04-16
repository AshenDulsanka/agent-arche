---
name: layout
description: "Diagnoses and fixes spatial problems — spacing, visual hierarchy, grid structure, and rhythmic flow. Use when the interface feels cramped, cluttered, unbalanced, or lacks visual hierarchy."
argument-hint: "[target]"
user-invocable: true
---

Fix spatial problems to create layouts that feel balanced, breathable, and visually clear.

## Mandatory Preparation

Read `.github/skills/impeccable/SKILL.md` and `reference/spatial-design.md` for the spatial design reference.

## Assess Layout Problems

Run through these checks to identify what's broken:

**Spacing**:
- Are spacing values arbitrary (17px, 23px) or from a scale?
- Is there a consistent spacing rhythm, or does it vary randomly?
- Does content feel cramped? Are elements breathing?
- Does content feel too spread out? Is white space purposeful?

**Visual Hierarchy**:
- Can you identify the most important element at a glance?
- Squint test: does hierarchy survive at 20% blur?
- Are there too many competing elements at the same visual weight?
- Does size differentiation feel meaningful or subtle?

**Grid & Structure**:
- Is there an underlying grid? Does content align to it?
- Do columns feel arbitrary or purposeful?
- Are there orphaned elements that feel disconnected?
- Is alignment consistent (left-align body text, etc.)?

**Rhythm & Variety**:
- Does the page feel monotonous (same card grid forever)?
- Are section breaks meaningful or just padding?
- Is there enough variation to maintain interest without chaos?

**Density**:
- Is the content density appropriate for the use case?
- Data-dense: tight grid, predictable structure
- Editorial: generous margins, breathing room
- Is density consistent throughout, or does it vary for no reason?

## Plan Layout Improvements

Based on assessment, define the strategy:

1. **Spacing system**: Choose a base unit (4px or 8px grid)
2. **Hierarchy strategy**: Define 3–4 size levels, not 8 arbitrary ones
3. **Layout approach**: Flexbox for 1D flow, CSS Grid for 2D structure
4. **Rhythm approach**: How to break monotony without sacrificing consistency

## Improve the Layout

### Spacing System

Use a consistent scale — no arbitrary pixel values:

```css
/* 4pt spacing scale */
--space-1: 4px;    /* Tight relationships (label → input) */
--space-2: 8px;    /* Related elements (icon → text) */
--space-3: 12px;   /* Grouped elements */
--space-4: 16px;   /* Default padding */
--space-5: 24px;   /* Component separation */
--space-6: 32px;   /* Section separation */
--space-8: 48px;   /* Major sections */
--space-10: 64px;  /* Page-level separation */
--space-12: 80px;  /* Hero sections */
```

**Use `gap` instead of margins between siblings**:
```css
/* ✅ Good: Explicit relationship */
.card-grid {
  display: grid;
  gap: var(--space-5);
}

/* ❌ Bad: Implicit margins */
.card:not(:last-child) {
  margin-bottom: 24px;
}
```

### Visual Hierarchy

**Create clear hierarchy through space, not just size**:
```css
/* Section heading gets more space above than below */
.section-heading {
  margin-top: var(--space-10);
  margin-bottom: var(--space-4);
}

/* Content items close to their heading */
.section-content {
  margin-bottom: var(--space-8);
}
```

**Size scale — 4 levels maximum for most UIs**:
```css
--text-xs: 0.75rem;   /* Labels, captions, metadata */
--text-sm: 0.875rem;  /* Secondary text, hints */
--text-base: 1rem;    /* Body text */
--text-lg: 1.125rem;  /* Slightly emphasized */
--text-xl: 1.25rem;   /* Component headings */
--text-2xl: 1.5rem;   /* Section headings */
--text-3xl: 1.875rem; /* Page headings */
--text-4xl: 2.25rem;  /* Hero headings */
```

### Grid Structure

**Use Auto-fit for responsive grids**:
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}
```

**Use named grid areas for complex layouts**:
```css
.page-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr auto;
}
```

**1D flow → Flexbox, 2D structure → Grid**:
```css
/* Navigation (1D flow) */
.nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Page layout (2D structure) */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 300px;
  gap: var(--space-6);
}
```

### Break Monotony

Break card grid monotony without chaos:

```css
/* Feature card spans two columns */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.card--featured {
  grid-column: span 2;
}
```

Or introduce layout variety through section-level rhythm:
- Dense card grid → Featured callout → Two-column editorial → Dense card grid

### Z-Index Semantic Scale

Avoid arbitrary z-index values:

```css
--z-base: 0;
--z-raised: 10;       /* Cards on hover */
--z-dropdown: 100;    /* Dropdowns, tooltips */
--z-sticky: 200;      /* Sticky headers */
--z-overlay: 300;     /* Backdrop overlays */
--z-modal: 400;       /* Modal dialogs */
--z-toast: 500;       /* Notifications */
```

### Optical Adjustments

Trust visual perception over mathematical precision:

```css
/* Icons appear lower than center, shift up slightly */
.icon-button {
  padding: 9px 10px 7px; /* Not 8px all around */
}

/* Text in colored boxes needs slightly more horizontal padding */
.badge {
  padding: 2px 8px; /* Not 4px all around */
}
```

## Verify Layout Quality

Run these checks after changes:

- **Squint test**: Blur eyes or screenshot — is hierarchy still clear?
- **Rhythm check**: Do sections breathe without excessive scrolling?
- **Hierarchy check**: One clear focal point per section?
- **Breathing room**: Does content feel cluttered or spacious?
- **Consistency**: Are spacing values from the scale?
- **Responsiveness**: Does layout hold up at mobile widths?
- **Spacing scale**: No arbitrary pixel values (17px, 23px, etc.)?
- **Alignment**: Do elements share invisible alignment lines?

**NEVER**:
- Use arbitrary spacing values (always use a scale)
- Create more than 4–5 visual hierarchy levels
- Use deep nesting when flat structure works
- Fix layout without understanding the content hierarchy first
- Make mobile layout an afterthought
- Over-correct (adding too much white space is also a problem)
