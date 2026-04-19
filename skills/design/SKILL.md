---
name: design
description: Senior UI/UX Engineer. Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when building web components, pages, artifacts, dashboards, or applications — or any request for UI/UX work, styling, beautification, or frontend code. Enforces Anti-Codex aesthetics inspired by Linear, Raycast, Stripe, and GitHub. Driven by metric dials, strict component architecture, hardware-accelerated motion, and curated design systems.
---

> **Framework note:** Examples default to React/Next.js. Adapt all framework-specific code to the project's actual stack (SvelteKit, Vue, Angular, etc.).

---

# Design Skill — Anti-Codex + High-Agency

---

## 0. WHAT IS CODEX UI (AND WHY TO AVOID IT)

Codex UI is the default AI aesthetic: soft gradients, floating panels, eyebrow labels, decorative copy, hero sections in dashboards, oversized rounded corners, bouncy transform animations, dramatic shadows, and layouts that try too hard to look premium. It is the visual language that screams "an AI made this."

The goal is UI that feels **human-designed, functional, and honest** — like Linear, Raycast, Stripe, or GitHub.

**Before writing any code:** list all the Codex-y things you'd normally do — and don't do them.

---

## 1. ACTIVE BASELINE CONFIGURATION (Dials)

| Dial | Default | Scale |
|---|---|---|
| `DESIGN_VARIANCE` | **8** | 1 = Perfect Symmetry → 10 = Artsy Chaos |
| `MOTION_INTENSITY` | **6** | 1 = Static → 10 = Cinematic / Magic Physics |
| `VISUAL_DENSITY` | **4** | 1 = Art Gallery / Airy → 10 = Cockpit / Packed Data |

**AI Instruction:** These are fixed defaults. Do NOT ask the user to edit them. ALWAYS override dynamically if the user explicitly requests different values in chat. Use these as global variables driving Sections 5–9.

---

## 2. DESIGN THINKING (Before Any Code)

Before coding, commit to a **bold aesthetic direction**:

- **Purpose:** What problem does this interface solve? Who uses it?
- **Tone:** Pick an extreme and execute it with precision — brutally minimal, maximalist, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, industrial/utilitarian. Commit.
- **Constraints:** Framework, performance, accessibility.
- **Differentiation:** What makes this unforgettable? What is the one thing someone will remember?

A landing page needs its sections. A dashboard needs its sidebar and full layout. **Do not invent weird layouts — replicate Figma/designer-made components.**

---

## 3. TECHNICAL ARCHITECTURE & CONVENTIONS

### Dependency Verification [MANDATORY]
Before importing ANY 3rd party library (`framer-motion`, `lucide-react`, `zustand`, etc.), check `package.json`. If missing, output the install command before the code. **Never assume a library exists.**

### Framework & Interactivity
- Default to Server Components (RSC) in Next.js.
- **RSC Safety:** Global state works only in Client Components. Wrap providers in `"use client"`.
- **Interactivity Isolation:** If motion/glass effects are active, extract that component as an isolated leaf with `'use client'` at the top. Server Components render static layouts only.

### Styling Policy
- Tailwind CSS (v3/v4) for 90% of styling.
- **Tailwind Version Lock:** Check `package.json`. Do not use v4 syntax in v3 projects.
- **T4 Config Guard:** For v4, do NOT use `tailwindcss` plugin in `postcss.config.js` — use `@tailwindcss/postcss` or the Vite plugin.

### Responsiveness & Spacing
- Standardize breakpoints: `sm`, `md`, `lg`, `xl`.
- Contain layouts: `max-w-[1400px] mx-auto` or `max-w-7xl`.
- **Viewport Stability [CRITICAL]:** NEVER use `h-screen` for Hero sections. ALWAYS use `min-h-[100dvh]` to prevent iOS Safari layout collapse.
- **Grid over Flex-Math:** NEVER use `w-[calc(33%-1rem)]`. ALWAYS use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`).

### Icons
Use `@phosphor-icons/react` or `@radix-ui/react-icons` (check installed). Standardize `strokeWidth` globally (e.g. exclusively `1.5` or `2.0`).

### Anti-Emoji [CRITICAL]
**NEVER** use emojis in code, markup, text, or alt text. Replace with high-quality icons (Radix, Phosphor) or SVG primitives. Emojis are banned.

---

## 4. COLOR & THEME SYSTEM

### Selection Priority
1. **Highest priority:** Use colors from the user's existing project if available (search files).
2. If no palette exists, draw from the curated tables below.
3. **Never invent random color combinations.**
4. Max **1 accent color**. Saturation < 80%.
5. **THE AI PURPLE/BLUE BAN:** Purple/blue AI aesthetic is strictly banned. No purple button glows, no neon gradients. Use absolute neutral bases (Zinc/Slate) with one high-contrast accent (Emerald, Electric Blue, Deep Rose).
6. **COLOR CONSISTENCY:** Never mix warm and cool grays within the same project.

---

### Dark Color Palettes

| Palette | Background | Surface | Primary | Secondary | Accent | Text |
|---|---|---|---|---|---|---|
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

---

### Light Color Palettes

**No pure white backgrounds.** Pure white (`#ffffff`, `#fafafa`, `#f8f9fa`) is banned from backgrounds — it causes eye strain and reads as sterile. Use warm off-whites anchored to cream tones (`#f0eee6` page background, `#eae8e0` surface).

| Palette | Background | Surface | Primary | Secondary | Accent | Text |
|---|---|---|---|---|---|---|
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

## 5. DESIGN ENGINEERING DIRECTIVES
LLMs have statistical biases toward specific UI cliché patterns. Proactively construct premium interfaces using these engineered rules:

### Rule 1: Deterministic Typography
- **Display/Headlines:** Default to `text-4xl md:text-6xl tracking-tighter leading-none`
- **Banned fonts:** `Inter`, `Arial`, `Roboto`, `Segoe UI`, `Trebuchet MS` — these are banned unless the project already uses them.
- **Preferred fonts:** `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`, `DM Sans`
- **Serif ban:** Serif fonts are strictly banned for Dashboard/Software UIs. Use exclusively high-end sans-serif pairings (`Geist` + `Geist Mono` or `Satoshi` + `JetBrains Mono`). Serif is OK for creative/editorial designs only.
- **Body/Paragraphs:** Default to `text-base text-gray-600 leading-relaxed max-w-[65ch]`
- **No oversized H1s.** Control hierarchy with weight and color, not scale alone.

### Rule 2: Layout Diversification
- **Anti-Center Bias:** Centered Hero/H1 sections are banned when `DESIGN_VARIANCE > 4`. Force "Split Screen" (50/50), "Left-Aligned content / Right-Aligned asset", or "Asymmetric Whitespace".
- **Mobile Override:** Any asymmetric layout above `md:` MUST fall back to a strict single-column (`w-full`, `px-4`, `py-8`) on viewports `< 768px`.
- **No 3-Column Card Layouts:** Generic equal-width 3-card rows are banned. Use 2-column Zig-Zag, asymmetric grids, or horizontal scrolling.

### Rule 3: Cards, Surfaces & Shadows
- Use cards **only** when elevation communicates hierarchy.
- For `VISUAL_DENSITY > 7`: no card containers — use `border-t`, `divide-y`, or negative space only.
- When a shadow is used, tint it to the background hue.
- Max shadow: `0 2px 8px rgba(0,0,0,0.1)`. No dramatic drop shadows. No colored shadows.
- Card radius: 8–12px max. No oversized rounded corners (20–32px range).

### Rule 4: Interactive UI States [MANDATORY]
Always implement the full interaction cycle — never generate only "happy path" states:
- **Loading:** Skeletal loaders matching layout sizes (no generic spinners)
- **Empty States:** Beautifully composed empty states with guidance on populating data
- **Error States:** Clear inline error reporting (forms especially)
- **Tactile Feedback:** On `:active`, use `-translate-y-[1px]` or `scale-[0.98]` to simulate a physical press

### Rule 5: Data & Form Patterns
- Labels **above** inputs, always. Helper text optional. Error text below input. `gap-2` for input blocks.
- Tables: clean rows, subtle borders, subtle hover, left-aligned text.
- **No fake numbers:** Use organic, messy data (`47.2%`, `+1 (312) 847-1928`) not `99.99%` or `50%`.
- **No generic names:** "John Doe", "Sarah Chan" are banned. Use creative, realistic-sounding names.
- **No startup slop names:** "Acme", "Nexus", "SmartFlow" are banned. Invent premium, contextual brand names.
- **No filler copy:** "Elevate", "Seamless", "Unleash", "Next-Gen" are banned. Use concrete verbs.

---

## 6. MOTION & ANIMATION

### By Dial Level

**`MOTION_INTENSITY` 1–3 (Static):**
No automatic animations. CSS `:hover` and `:active` states only.

**`MOTION_INTENSITY` 4–7 (Fluid CSS):**
- `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`
- `animation-delay` cascades for load-ins
- Strictly animate `transform` and `opacity` only
- `will-change: transform` used sparingly
- Focus on high-impact moments: one well-orchestrated page load with staggered reveals beats scattered micro-interactions

**`MOTION_INTENSITY` 8–10 (Advanced Choreography):**
- Framer Motion with Spring Physics: `type: "spring", stiffness: 100, damping: 20`
- `layout` and `layoutId` props for smooth re-ordering and shared element transitions
- Scroll-triggered reveals or parallax — NEVER use `window.addEventListener('scroll')`; use Framer Motion or GSAP ScrollTrigger
- **Magnetic Micro-physics:** Use `useMotionValue` and `useTransform` (never `useState` for cursor tracking)
- Staggered orchestration: `staggerChildren` in Framer or `animation-delay: calc(var(--index) * 100ms)`
- **CRITICAL:** Never mix GSAP/ThreeJS with Framer Motion in the same component tree

### Motion Rules (All Levels)
- No bouncy animations
- No `translateX(2px)` hover transforms on nav links
- Transitions: 100–200ms ease for subtle states; spring physics for interactive elements
- Perpetual infinite loops MUST be memoized (`React.memo`) and isolated in their own Client Component

---

## 7. HARD NO — BANNED PATTERNS

Everything below is a strict ban. If a UI choice feels like a default AI move, pick the harder, cleaner option.

### Visual & CSS
- No neon/outer glows — use inner borders or subtle tinted shadows
- No pure black `#000000` — use Off-Black, Zinc-950, Charcoal
- No oversaturated accents
- No excessive gradient text on large headers
- No custom mouse cursors (performance + accessibility killer)
- No floating glassmorphism shells as the primary design language
- No soft corporate gradients used to fake taste
- No random glows, blur haze, frosted panels, or conic-gradient donuts as decoration
- No "premium dark mode" that means blue-black gradients + cyan accents
- No dramatic box shadows (`0 24px 60px rgba(0,0,0,0.35)`)
- No pipeline bars with gradient fills
- No colored status glow dots

### Layout & Structure
- No oversized rounded corners (20–32px across everything)
- No pill overload
- No sticky left rail unless the IA truly requires it
- No floating detached sidebar with rounded outer shell
- No hero sections inside internal dashboards unless there is a real product reason
- No overpadded layouts
- No mobile collapse that stacks everything into one long beige sandwich
- No mixed alignment logic (some content hugs left, some floats center-ish)

### Components & Patterns
- No metric-card grid as the first dashboard instinct
- No fake charts that exist only to fill space
- No donut chart paired with hand-wavy percentages
- No KPI cards in a grid as the default layout
- No workspace blocks in sidebar with CTA buttons
- No quota/usage panels with progress bars (unless functionally required)
- No trend indicators with colored text classes (`trend-up`, `trend-flat`)
- No right-rail "Today" schedule panels (unless explicitly requested)
- No multiple nested panel types (`panel`, `panel-2`, `rail-panel`, `table-panel`)
- No tables with tag badges on every single status cell
- No brand marks with gradient backgrounds
- No nav badges showing counts or "Live" status (unless functional)
- No canvas chart placed in a glass card for no product reason
- No status indicators built exclusively with `::before` colored dots

### Typography & Copy
- No `Inter`, `Arial`, `Roboto`, `Segoe UI`, `Trebuchet MS` (unless pre-existing in project)
- No mixed serif/sans combos as a "premium" shortcut
- No eyebrow labels (`MARCH SNAPSHOT` with uppercase + letter-spacing)
- No `<small>` eyebrow + `<h2>` combos — **the single biggest Codex tell**
- No decorative copy like "Operational clarity without the clutter" as a page header
- No ornamental labels ("live pulse", "night shift") unless they come from the product's own voice
- No section notes and mini-notes everywhere explaining what the UI does
- No generic startup copy
- No muted gray-blue text overuse that weakens contrast

### The Explicitly Banned Structural Pattern

**This is THE BIGGEST NO:**
```html
<!-- NEVER DO THIS -->
<div class="headline">
  <small>Team Command</small>
  <h2>One place to track what matters today.</h2>
  <p>The layout stays strict and readable...</p>
</div>

<!-- AND NEVER THIS -->
<div class="team-note">
  <small>Focus</small>
  <strong>Keep updates brief, blockers visible, and next actions easy to spot.</strong>
</div>
```

### External Resources
- No Unsplash links (broken). Use `https://picsum.photos/seed/{random_string}/800/600` or SVG UI Avatars
- `shadcn/ui` is allowed but NEVER in its generic default state — customize radius, colors, shadows

---

## 8. PERFORMANCE GUARDRAILS

- **DOM Cost:** Apply grain/noise filters only to `fixed, pointer-events-none` pseudo-elements — NEVER to scrolling containers.
- **Hardware Acceleration:** Animate exclusively via `transform` and `opacity`. NEVER animate `top`, `left`, `width`, or `height`.
- **Z-Index Restraint:** No arbitrary `z-50` or `z-10`. Use z-indexes only for systemic layers (sticky navbars, modals, overlays).
- **Perpetual Animations:** Must be `React.memo`-isolated Client Components — never trigger parent re-renders.
- **Framer/GSAP Rule:** Framer Motion for UI/Bento interactions. GSAP/ThreeJS exclusively for isolated full-page scroll or canvas backgrounds, always with `useEffect` cleanup.

---

## 9. DIAL DEFINITIONS

### DESIGN_VARIANCE
- **1–3 (Predictable):** `justify-center`, strict 12-column grids, equal paddings.
- **4–7 (Offset):** `margin-top: -2rem` overlapping, varied aspect ratios, left-aligned headers over center data.
- **8–10 (Asymmetric):** Masonry, CSS Grid fractional units (`grid-template-columns: 2fr 1fr 1fr`), massive empty zones (`padding-left: 20vw`).

### MOTION_INTENSITY
- **1–3 (Static):** `:hover` and `:active` CSS only.
- **4–7 (Fluid):** CSS `transition`, `animation-delay` cascades, transform/opacity only.
- **8–10 (Choreography):** Framer Motion spring physics, scroll triggers, magnetic interactions.

### VISUAL_DENSITY
- **1–3 (Art Gallery):** Huge section gaps, generous whitespace, everything expensive and clean.
- **4–7 (Daily App):** Normal spacing for standard web apps.
- **8–10 (Cockpit):** Tiny paddings, no card boxes — just 1px lines separating data. Use `font-mono` for all numbers.

---

## 10. THE CREATIVE ARSENAL

Pull from this list to avoid generic UI. Do not default to standard patterns.

### Navigation
- Mac OS Dock Magnification, Magnetic Buttons, Gooey Menus, Dynamic Island pill, Contextual Radial Menus, Floating Speed Dials, Mega Menu Reveals

### Layouts
- Bento Grid (Apple Control Center asymmetric tiles), Masonry, Chroma Grid (animated gradient borders), Split Screen Scroll, Curtain Reveal

### Cards
- Parallax Tilt Card (3D mouse tracking), Spotlight Border Card (cursor-reactive borders), Glassmorphism with inner refraction (`border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`), Holographic Foil, Tinder Swipe Stack, Morphing Modal

### Scroll
- Sticky Scroll Stack, Horizontal Scroll Hijack, Locomotive Scroll Sequence, Zoom Parallax, Scroll Progress Path (SVG draw), Liquid Swipe Transition

### Galleries
- Dome Gallery, Coverflow Carousel, Drag-to-Pan Grid, Accordion Image Slider, Hover Image Trail, Glitch Effect Image

### Typography
- Kinetic Marquee, Text Mask Reveal (typography as video window), Text Scramble/Matrix Effect, Circular Text Path, Gradient Stroke Animation, Kinetic Typography Grid

### Micro-interactions
- Particle Explosion Button, Skeleton Shimmer, Directional Hover Aware Button (fill from mouse entry side), Ripple Click Effect, Animated SVG Line Drawing, Mesh Gradient Background, Lens Blur Depth

---

## 11. BENTO GRID PARADIGM (SaaS Dashboards)

When generating modern SaaS dashboards or feature showcase sections:

### Design Specs
- **Palette:** Background from the project palette or light off-white; Cards with 1px border `border-slate-200/50`
- **Surfaces:** `rounded-[2rem]` for major containers. Diffusion shadow: `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`
- **Typography:** `Geist`, `Satoshi`, or `Cabinet Grotesk`. `tracking-tight` for headers.
- **Labels:** Titles/descriptions sit **outside and below** cards — gallery-style, not inside the card header
- **Padding:** `p-8` or `p-10` inside cards

### Animation Engine
All cards must contain perpetual micro-interactions:
- Spring Physics: `type: "spring", stiffness: 100, damping: 20`
- `layout` + `layoutId` for smooth transitions
- Infinite loops: every card has an active state that loops (Pulse, Typewriter, Float, Carousel)
- Wrap dynamic lists in `<AnimatePresence>`
- **Performance:** All perpetual motion isolated in its own `React.memo` Client Component

### 5 Bento Card Archetypes
1. **Intelligent List:** Infinite auto-sorting loop with `layoutId` item swapping
2. **Command Input:** Multi-step Typewriter with blinking cursor + shimmer "processing" state
3. **Live Status:** Breathing status indicators + overshoot-spring notification badge (3s duration)
4. **Wide Data Stream:** Seamless infinite horizontal carousel (`x: ["0%", "-100%"]`)
5. **Contextual Focus:** Staggered text highlight + float-in floating action toolbar with micro-icons

---

## 12. FINAL PRE-FLIGHT CHECKLIST

Before outputting any code, verify:

- [ ] No Codex UI patterns (eyebrow labels, pill overload, gradient cards, `<small>` + `<h2>` combos)
- [ ] Colors sourced from project or curated palette — no pure white backgrounds on light themes
- [ ] Font is NOT Inter, Arial, Roboto, Segoe UI, or Trebuchet MS
- [ ] No 3-column equal-card layouts
- [ ] Global state scoped correctly — not used arbitrarily
- [ ] Mobile layout collapses safely (`w-full`, `px-4`, `max-w-7xl mx-auto`)
- [ ] Full-height sections use `min-h-[100dvh]` not `h-screen`
- [ ] `useEffect` animations have cleanup functions
- [ ] Empty, loading, and error states are all implemented
- [ ] Cards omitted in favor of spacing where `VISUAL_DENSITY > 7`
- [ ] CPU-heavy perpetual animations isolated in their own `React.memo` Client Components
- [ ] No emojis anywhere in the output
- [ ] Image placeholders use `picsum.photos` not Unsplash
- [ ] Dependencies verified against `package.json` before importing
- [ ] Tailwind version checked — no v4 syntax in v3 projects