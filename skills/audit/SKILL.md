---
name: audit
description: "Scores a UI across five quality dimensions and identifies priority issues. Use when the user asks for an audit, review, quality check, or wants to know what needs fixing in their interface."
argument-hint: "[target]"
user-invocable: true
---

Systematically score and identify quality issues across five dimensions to create an actionable improvement plan.

## Mandatory Preparation

Before auditing, read `.github/skills/impeccable/SKILL.md` to load the full design quality reference system.

## Audit Framework

Score the UI across five dimensions, each 0–4:

### Dimension 1: Accessibility (0–4)
- **4 — Excellent**: WCAG AA compliant, proper ARIA, keyboard navigable, high contrast, screen reader tested
- **3 — Good**: Minor accessibility gaps, mostly accessible, contrast issues
- **2 — Acceptable**: Some keyboard gaps, missing ARIA labels, low contrast elements
- **1 — Poor**: Navigation fails without mouse, many contrast failures, no ARIA
- **0 — Critical**: Inaccessible to assistive technology, no keyboard support, illegible text

Check:
- Color contrast (4.5:1 text, 3:1 large text, 3:1 UI components)
- Keyboard navigation (focus visible, logical tab order)
- ARIA roles and labels on interactive elements
- Alt text on images
- Form labels and error messages
- Screen reader announcements for dynamic content

### Dimension 2: Performance (0–4)
- **4 — Excellent**: Lighthouse 90+, Core Web Vitals all green, optimized assets
- **3 — Good**: Lighthouse 75–89, most vitals good, minor issues
- **2 — Acceptable**: Lighthouse 50–74, some vitals amber, noticeable load time
- **1 — Poor**: Lighthouse 25–49, vitals red, slow and unresponsive
- **0 — Critical**: Lighthouse below 25, unusable on slow connections

Check:
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Image optimization (format, compression, sizing)
- JavaScript bundle size
- Render-blocking resources
- Font loading strategy
- Animation smoothness (60fps)

### Dimension 3: Responsive Design (0–4)
- **4 — Excellent**: Fluid across all viewports, mobile-first, touch-optimized
- **3 — Good**: Works well but minor breakpoint issues
- **2 — Acceptable**: Functional but awkward at some sizes, horizontal scroll possible
- **1 — Poor**: Breaks on mobile, content overflows, unusable on touch
- **0 — Critical**: Desktop-only, completely broken on mobile

Check:
- Mobile viewport (320px–767px)
- Tablet viewport (768px–1023px)
- Touch targets ≥ 44px
- No horizontal overflow
- Readable text without zooming
- Navigation accessible on small screens

### Dimension 4: Theming & Visual Consistency (0–4)
- **4 — Excellent**: Coherent design system, consistent tokens, polished details
- **3 — Good**: Consistent but mismatched spacing/colors in places
- **2 — Acceptable**: Visual inconsistencies, mismatched components, no clear system
- **1 — Poor**: Many inconsistencies, arbitrary values, no visual cohesion
- **0 — Critical**: Design feels broken, no consistency, undermines trust

Check:
- Consistent color usage (semantic tokens not arbitrary values)
- Consistent spacing (spacing scale used)
- Consistent typography (defined scale, not arbitrary sizes)
- Consistent component styles (same buttons look the same)
- Coherent visual language (elements feel related)

### Dimension 5: Anti-Patterns (0–4)
- **4 — Excellent**: No anti-patterns detected, follows best practices throughout
- **3 — Good**: One or two minor issues, easily fixed
- **2 — Acceptable**: Several patterns present, noticeable quality impact
- **1 — Poor**: Multiple high-severity patterns, degrades experience
- **0 — Critical**: Pervasive anti-patterns, design actively harms usability

Check for:
- Dark patterns (hidden costs, misleading UI, forced continuity)
- Visual noise (competing elements, no clear hierarchy)
- Cluttered layouts (too much in too little space)
- Inconsistent affordances (same look, different behavior)
- Broken feedback (no response to user actions)
- Jargon (technical language, unexplained acronyms)
- Over-animation (motion without purpose)

## Severity Scale

Tag each issue with priority:

| Level | Label | Definition |
|-------|-------|------------|
| **P0** | Critical | Blocks core functionality or causes significant harm |
| **P1** | High | Significantly degrades experience for many users |
| **P2** | Medium | Noticeable issue worth fixing in next iteration |
| **P3** | Low | Minor polish or improvement, low urgency |

## Scoring Table

| Dimension | Score (0–4) | Rating |
|-----------|-------------|--------|
| Accessibility | | |
| Performance | | |
| Responsive Design | | |
| Theming & Consistency | | |
| Anti-Patterns | | |
| **Total** | **/20** | |

**Rating Bands**:
- **18–20** — Excellent: Ship-ready, only minor polish needed
- **14–17** — Good: Solid foundation, addressable issues
- **10–13** — Acceptable: Works but needs significant improvement
- **6–9** — Poor: Core experience degraded, prioritize fixes
- **0–5** — Critical: Fundamental issues blocking quality launch

## Audit Report Structure

Present findings in this order:

### Anti-Patterns Verdict
State immediately whether anti-patterns were found and severity.

### Executive Summary
- Overall score and rating band
- Biggest strengths (1–3)
- Most critical issues (1–3)
- Recommended priority order

### Detailed Findings

For each dimension:
```
## [Dimension Name] — [Score]/4

**Strengths:**
- [What's working well]

**Issues:**
- [P0/P1/P2/P3] [Specific issue with evidence]
- [P0/P1/P2/P3] [Specific issue with evidence]
```

### Systemic Issues
Patterns that cut across multiple dimensions (e.g., "no design system creates inconsistencies in visual appearance, accessible color usage, and responsive behavior").

### Positive Findings
Things done well that shouldn't be changed.

### Recommended Actions
Ordered by impact, referencing specific skills for each fix:

1. **[P0 issue]** → use `audit` or `polish`
2. **[P1 issue]** → use `optimize` or `typeset`
3. **[P2 issue]** → use `layout` or `animate`
4. **[P3 issues]** → batch with `polish` at end

Always end recommended actions with `polish` for final quality pass.

**NEVER**:
- Score without evidence (each score needs justification)
- Audit without seeing the actual code or screenshots
- Recommend fixes without referencing the available skills: `polish, animate, optimize, audit, critique, layout, typeset, shape, adapt`
- Give only criticism without positive findings
- Skip the executive summary (actionability is the goal)
