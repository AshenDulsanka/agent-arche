---
name: design-intelligence
description: Product-aware UI/UX design direction and skill routing. Use before creating, redesigning, auditing, or animating interfaces when Codex must choose the right visual direction, page structure, design-system brief, motion level, accessibility priorities, and follow-up skills for premium, professional, user-fit UI.
---

# Design Intelligence

Use this skill before implementation or review whenever the work changes how an interface looks, feels, moves, persuades, or is used.

The goal is not one fixed aesthetic. The goal is a UI that fits the user's product, audience, task, and quality bar.

## 1. Classify The UI Job

Choose the primary job before loading deeper skills:

| Job | Use |
|---|---|
| New page, component, app screen, dashboard, landing page | `design` |
| Existing UI needs premium upgrade without rewrites | `redesign` |
| Everyday motion, transitions, hover, state changes | `animate` |
| Cinematic scroll, pinned sections, timelines, page choreography | `gsap` |
| UX/accessibility score before launch | `ui-audit` |
| Deep heuristic/persona critique | `critique` |
| Slow, janky, layout-shifting, heavy media UI | `ui-optimize` |
| High-end agency softness, glass, luxury, editorial mood | `soft` |
| Quiet editorial/workspace minimalism | `minimalist` |
| Tactical, mechanical, raw, data-dense, Swiss/terminal look | `brutalist` |
| Generate a semantic `DESIGN.md` for Google Stitch | `stitch` |

Load `design` for implementation after this skill unless the task is purely review-only.

## 2. Build The Design-System Brief

Before writing UI code, produce or mentally lock this brief:

- **User goal:** What the screen must help the user do.
- **Product type:** SaaS, dashboard, marketplace, consumer app, portfolio, docs, admin, e-commerce, creative site, tool, game, or another specific category.
- **Audience:** Buyer, operator, developer, creator, executive, casual consumer, power user, or accessibility-sensitive audience.
- **Primary moment:** First impression, repeated workflow, comparison, decision, data monitoring, creation, checkout, onboarding, or recovery from error.
- **Tone:** Professional, premium, elegant, playful, editorial, utilitarian, cinematic, calm, technical, raw, luxurious, or intentionally weird.
- **Density:** Airy, balanced, or dense. Dashboards and admin tools default to balanced/dense; marketing and editorial pages default to airy/balanced.
- **Motion level:** Static, subtle, expressive, or cinematic. Never choose cinematic for routine productivity UI unless asked.
- **Structure:** Navigation model, page sections, information hierarchy, CTA placement, and empty/loading/error states.
- **System:** Color roles, typography pairing, spacing scale, radius/shadow policy, icon family, focus states, and responsive breakpoints.
- **Anti-patterns:** The specific cliches this UI must avoid.

If the repo already has brand tokens, CSS variables, components, or previous design decisions, they override a new invented system.

## 3. Product-Fit Defaults

Use these as starting points, then adapt to user intent:

| Product | Good defaults | Avoid |
|---|---|---|
| SaaS / B2B app | restrained palette, strong type hierarchy, clear nav, dense but calm surfaces | marketing hero inside dashboards, fake metric card grids |
| Admin / dashboard | tabular clarity, filters, persistent state, mono numerals, restrained motion | decorative cards, mystery icons, color-only status |
| Landing page | strong first viewport, proof, focused CTA, visual asset, memorable structure | centered gradient hero with two generic buttons |
| E-commerce | product imagery first, trust signals, clear pricing, fast checkout states | vague lifestyle visuals replacing inspectable product info |
| Portfolio / creative | distinctive art direction, editorial layout, richer motion | generic card grids, stock-looking mockups |
| Developer tool | precise copy, dark/light aware tokens, keyboard affordances, code/data examples | playful metaphors that obscure workflow |
| Healthcare / finance / legal | trust, legibility, accessibility, conservative motion, explicit recovery paths | neon, gimmicks, unclear risk language |
| Consumer mobile/web app | touch targets, direct language, friendly feedback, safe-area awareness | hover-only behavior, tiny controls, dense desktop-first layouts |

## 4. Premium Quality Bar

Every implementation should include:

- One clear primary action per view.
- Visible hover, focus, active, disabled, loading, empty, and error states where relevant.
- Touch targets at least 44px and no horizontal overflow on mobile.
- Color contrast that meets WCAG AA for text and important UI controls.
- Text that fits containers without clipping, overlapping, or tiny viewport-scaled hacks.
- Realistic content, not lorem ipsum, fake round numbers, or generic names.
- Consistent icon style from an installed or project-standard icon set.
- Motion that explains cause/effect or improves feedback, with `prefers-reduced-motion`.
- Visual assets for websites, landing pages, games, or product-focused pages when assets matter.

## 5. Motion Decision

Use the lowest motion level that makes the experience feel excellent:

- **Static:** Compliance, finance, legal, dense operations, or when performance is tight.
- **Subtle:** Most product UI. Use transitions, pressed states, skeletons, and small reveal sequences.
- **Expressive:** Marketing, onboarding, creative tools, empty states, product showcases.
- **Cinematic:** Explicit GSAP/scroll storytelling, campaign pages, immersive hero experiences.

Escalate to `gsap` only for pinned scroll, scrubbed timelines, section choreography, or immersive editorial pages.

## 6. Preflight Output

For substantial UI work, include a short design direction before code:

```markdown
Design direction:
- Product/audience:
- Tone:
- Structure:
- Palette/type:
- Motion:
- Key states:
- Avoid:
```

Keep it brief. Then implement.
