---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics and Codex-style patterns. Enforces clean, human-designed aesthetics inspired by Linear, Raycast, Stripe, and GitHub.
---

# Frontend Design + Uncodixify

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics **and** the default AI visual language known as Codex UI.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

---

## What is Codex UI (and Why to Avoid It)

Codex UI is the default AI aesthetic: soft gradients, floating panels, eyebrow labels, decorative copy, hero sections in dashboards, oversized rounded corners, transform animations, dramatic shadows, and layouts that try too hard to look premium. It's the visual language that screams "an AI made this" because it follows the path of least resistance.

Every banned pattern below is a red flag. The goal is UI that feels human-designed, functional, and honest — like **Linear, Raycast, Stripe, or GitHub**. Not another generic AI dashboard.

In your internal reasoning: list all the Codex-y things you'd normally do — **and don't do them**.

---

## Design Thinking (Before Any Code)

Before coding, understand the context and commit to a **BOLD aesthetic direction**:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme and execute it with precision: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these as inspiration but design one that is true to the direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, Svelte, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

A landing page needs its sections. A dashboard needs its sidebar and full layout. **Do not invent weird layouts — replicate Figma/designer-made components.**

---

## Aesthetic Guidelines

### Typography
Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial, Inter, Roboto, Segoe UI, Trebuchet MS, and safe default stacks unless the product already uses them. Opt for distinctive, unexpected, characterful font choices that elevate the aesthetics. Pair a distinctive display font with a refined body font.

### Color & Theme
Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Priority order when selecting colors:**
1. **Highest priority:** Use the existing colors from the user's project if provided (search a few files for them).
2. If no project palette exists, **get inspired from one of the predefined palettes below**.
3. **Do not invent random color combinations** unless explicitly requested.
4. Colors should stay calm, not fight. Colors going toward generic blue — **nope**. Dark muted colors are best.

You do not always have to choose the first palette. Select randomly when drawing inspiration.

### Motion
Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise. Transitions: 100–200ms ease, no bouncy animations, no transform effects on nav links, simple opacity/color changes.

### Spatial Composition
Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density. Do not use alignment that creates dead space just to look expensive.

### Backgrounds & Visual Details
Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

**Match implementation complexity to vision.** Maximalist designs need elaborate code with extensive animations. Minimalist designs need restraint, precision, careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

---

## Keep It Normal (Anti-Codex UI Standard)

These are the correct, human patterns. Follow them strictly.

- **Sidebars**: 240–260px fixed width, solid background, simple `border-right`, no floating shells, no rounded outer corners
- **Headers**: simple text, no eyebrows, no uppercase labels, no gradient text, just h1/h2 with proper hierarchy — **no headlines of any sort in dashboard headers**
- **Sections**: standard padding 20–30px, no hero blocks inside dashboards, no decorative copy
- **Navigation**: simple links, subtle hover states, no transform animations (translateX is banned), no badges unless functional
- **Buttons**: solid fills or simple borders, 8–10px radius max, no pill shapes, no gradient backgrounds
- **Cards**: simple containers, 8–12px radius max, subtle borders, no shadows over 8px blur, no floating effect
- **Forms**: standard inputs, clear labels above fields, no fancy floating labels, simple focus states
- **Inputs**: solid borders, simple focus ring, no animated underlines, no morphing shapes
- **Modals**: centered overlay, simple backdrop, no slide-in animations, straightforward close button
- **Dropdowns**: simple list, subtle shadow, no fancy animations, clear selected state
- **Tables**: clean rows, simple borders, subtle hover, no zebra stripes unless needed, left-aligned text
- **Lists**: simple items, consistent spacing, no decorative bullets, clear hierarchy
- **Tabs**: simple underline or border indicator, no pill backgrounds, no sliding animations
- **Badges**: small text, simple border or background, 6–8px radius, no glows, only when needed
- **Avatars**: simple circle or rounded square, no decorative borders, no status rings unless functional
- **Icons**: simple shapes, consistent size 16–20px, no decorative icon backgrounds, monochrome or subtle color
- **Typography**: system fonts or simple sans-serif, clear hierarchy, no mixed serif/sans combos, readable sizes 14–16px body
- **Spacing**: consistent scale 4/8/12/16/24/32px, no random gaps, no excessive padding, no overpadded layouts
- **Borders**: 1px solid, subtle colors, no thick decorative borders, no gradient borders
- **Shadows**: subtle `0 2px 8px rgba(0,0,0,0.1)` max, no dramatic drop shadows, no colored shadows
- **Layouts**: standard grid/flex, no creative asymmetry, predictable structure, clear content hierarchy
- **Grids**: consistent columns, standard gaps, no creative overlaps, responsive breakpoints
- **Containers**: max-width 1200–1400px, centered, standard padding
- **Panels**: simple background differentiation, subtle borders, no floating detached panels, no glass effects
- **Toolbars**: simple horizontal layout, standard height 48–56px, clear actions, no decorative elements
- **Footers**: simple layout, standard links, no decorative sections, minimal height
- **Breadcrumbs**: simple text with separators, no fancy styling, clear hierarchy

Think Linear. Think Raycast. Think Stripe. Think GitHub. They don't try to grab attention. They just work.

---

## Hard No (Codex UI Patterns — Never Do These)

- No oversized rounded corners (20–32px range across everything)
- No pill overload
- No floating glassmorphism shells as the default visual language
- No soft corporate gradients used to fake taste
- No generic dark SaaS UI composition
- No decorative sidebar blobs
- No "control room" cosplay unless explicitly requested
- No serif headline + system sans fallback combo as a shortcut to "premium"
- No `Segoe UI`, `Trebuchet MS`, `Arial`, `Inter`, `Roboto`, or safe default stacks unless the product already uses them
- No sticky left rail unless the information architecture truly needs it
- No metric-card grid as the first instinct
- No fake charts that exist only to fill space
- No random glows, blur haze, frosted panels, or conic-gradient donuts as decoration
- No "hero section" inside an internal UI unless there is a real product reason
- No overpadded layouts
- No mobile collapse that just stacks everything into one long beige sandwich
- No ornamental labels like "live pulse", "night shift", "operator checklist" unless they come from the product voice
- No generic startup copy
- No style decisions made because they are easy to generate
- No `<small>` eyebrow headers (e.g. `<small>Team Command</small>` followed by an h2) — this is **the biggest no**
- No big rounded `span`s
- No repeating the same rounded rectangle on sidebar, cards, buttons, and panels simultaneously
- No floating detached sidebar with rounded outer shell
- No canvas chart placed in a glass card with no product-specific reason
- No donut chart paired with hand-wavy percentages
- No UI cards using glows instead of hierarchy
- No mixed alignment logic (some content hugs left edge, some floats center-ish)
- No overuse of muted gray-blue text that weakens contrast and clarity
- No "premium dark mode" that really means blue-black gradients plus cyan accents
- No UI typography that feels like a template instead of a brand
- No eyebrow labels (e.g. "MARCH SNAPSHOT" uppercase with letter-spacing)
- No decorative copy like "Operational clarity without the clutter" as page headers
- No section notes and mini-notes everywhere explaining what the UI does
- No `translateX(2px)` transform animations on nav link hovers
- No dramatic box shadows (e.g. `0 24px 60px rgba(0,0,0,0.35)`)
- No status indicators built exclusively with `::before` pseudo-elements creating colored dots
- No muted labels with uppercase + letter-spacing overused as a pattern
- No pipeline bars with gradient fills
- No KPI cards in a grid as the default dashboard layout
- No "Team focus" or "Recent activity" panels with decorative internal copy
- No tables with tag badges for every single status
- No workspace blocks in sidebar with call-to-action buttons
- No brand marks with gradient backgrounds
- No nav badges showing counts or "Live" status
- No quota/usage panels with progress bars (unless functionally required)
- No footer lines with meta information (e.g. "Dashboard • dark mode • single-file HTML")
- No trend indicators with colored text classes (trend-up, trend-flat)
- No right-rail panels with "Today" schedule unless explicitly requested
- No multiple nested panel types (panel, panel-2, rail-panel, table-panel, etc.)

**The rule**: If a UI choice feels like a default AI move, ban it and pick the harder, cleaner option.

### Specifically Banned Structural Patterns

This is banned:
```html
<div class="headline">
  <small>Team Command</small>
  <h2>One place to track what matters today.</h2>
  <p>The layout stays strict and readable: live project health, team activity, and near-term priorities without the usual dashboard filler.</p>
</div>
```

This is **THE BIGGEST NO** — never do this:
```html
<div class="team-note">
  <small>Focus</small>
  <strong>Keep updates brief, blockers visible, and next actions easy to spot.</strong>
</div>
```

---

## Color Palettes

NEVER converge on common choices (Space Grotesk, purple gradients, etc.) across generations. Vary between light and dark themes, different fonts, different aesthetics.

NEVER use generic AI-generated aesthetics: overused font families, clichéd color schemes (especially purple gradients on white backgrounds), predictable layouts, cookie-cutter design that lacks context-specific character.

### Dark Color Schemes

| Palette | Background | Surface | Primary | Secondary | Accent | Text |
|--------|-----------|---------|---------|-----------|--------|------|
| Midnight Canvas | `#0a0e27` | `#151b3d` | `#6c8eff` | `#a78bfa` | `#f472b6` | `#e2e8f0` |
| Obsidian Depth | `#0f0f0f` | `#1a1a1a` | `#00d4aa` | `#00a3cc` | `#ff6b9d` | `#f5f5f5` |
| Slate Noir | `#0f172a` | `#1e293b` | `#38bdf8` | `#818cf8` | `#fb923c` | `#f1f5f9` |
| Carbon Elegance | `#121212` | `#1e1e1e` | `#bb86fc` | `#03dac6` | `#cf6679` | `#e1e1e1` |
| Deep Ocean | `#001e3c` | `#0a2744` | `#4fc3f7` | `#29b6f6` | `#ffa726` | `#eceff1` |
| Charcoal Studio | `#1c1c1e` | `#2c2c2e` | `#0a84ff` | `#5e5ce6` | `#ff375f` | `#f2f2f7` |
| Graphite Pro | `#18181b` | `#27272a` | `#a855f7` | `#ec4899` | `#14b8a6` | `#fafafa` |
| Void Space | `#0d1117` | `#161b22` | `#58a6ff` | `#79c0ff` | `#f78166` | `#c9d1d9` |
| Twilight Mist | `#1a1625` | `#2d2438` | `#9d7cd8` | `#7aa2f7` | `#ff9e64` | `#dcd7e8` |
| Onyx Matrix | `#0e0e10` | `#1c1c21` | `#00ff9f` | `#00e0ff` | `#ff0080` | `#f0f0f0` |

### Light Color Schemes

**No pure white backgrounds.** All light palettes use warm off-whites anchored to the Claude/Anthropic interface palette (`#f0eee6` page background, `#eae8e0` surface). Pure white (`#ffffff`, `#fafafa`, `#f8f9fa`) is banned from backgrounds — it causes eye strain and reads as sterile. Cream and warm off-white tones are softer, more intentional, and more human.

| Palette | Background | Surface | Primary | Secondary | Accent | Text |
|--------|-----------|---------|---------|-----------|--------|------|
| Cloud Canvas | `#f0eee6` | `#eae8e0` | `#2563eb` | `#7c3aed` | `#dc2626` | `#0f172a` |
| Pearl Minimal | `#eeecea` | `#e8e6e2` | `#0066cc` | `#6610f2` | `#ff6b35` | `#1e1c1a` |
| Ivory Studio | `#f0ede6` | `#eae7e0` | `#0891b2` | `#06b6d4` | `#f59e0b` | `#1c1917` |
| Linen Soft | `#f0e9e0` | `#e9e1d8` | `#c2631a` | `#d97706` | `#0284c7` | `#292524` |
| Porcelain Clean | `#efeee8` | `#e9e8e2` | `#4f46e5` | `#8b5cf6` | `#ec4899` | `#111827` |
| Cream Elegance | `#f0ecdc` | `#e9e4d4` | `#5a8f0a` | `#78b314` | `#e06c10` | `#2d4a0a` |
| Warm Slate | `#eceae4` | `#e5e3dd` | `#0284c7` | `#0ea5e9` | `#f43f5e` | `#1a2e3b` |
| Alabaster | `#efede6` | `#e8e6df` | `#1d4ed8` | `#2563eb` | `#b91c1c` | `#1e293b` |
| Sand Warm | `#ede9e1` | `#e6e2da` | `#b45309` | `#d97706` | `#059669` | `#3a1a03` |
| Fog Bright | `#eaebe8` | `#e3e5e1` | `#0f766e` | `#14b8a6` | `#e11d48` | `#0f1f1a` |

---

## Final Rule

If a UI choice feels like a default AI UI move, ban it and pick the harder, cleaner option.

Remember: you are capable of extraordinary creative work. Don't hold back — show what can truly be created when thinking outside the box and committing fully to a distinctive, intentional vision. Bold maximalism and refined minimalism both work. The key is that every decision is deliberate, human-feeling, and unforgettable.