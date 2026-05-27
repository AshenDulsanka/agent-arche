# Design Workflow

## Goal

Create, improve, review, animate, optimize, or specify product-fit interfaces from one consolidated design skill.

## Execution Model

Use this micro-file architecture:

- Always start with `steps/direction.md` for substantial UI work, unless the request is a narrow review, performance, or formatting task.
- Load exactly one primary subflow for the user request.
- Load optional style resources only when the user asks for that aesthetic or the direction step makes it the best fit.
- Load `resources/output.md` when the user requests complete code, full files, or exhaustive unabridged output.

## Route The Request

| User intent | Primary file |
|---|---|
| New page, component, app screen, dashboard, landing page | `steps/implementation.md` |
| Product-fit brief, design-system direction, visual planning | `steps/direction.md` |
| Existing UI needs premium upgrade without behavior rewrites | `steps/redesign.md` |
| Everyday transitions, hover, focus, loading, empty/error motion | `steps/animate.md` |
| Explicit GSAP, ScrollTrigger, pinned scroll, scrubbed timelines, cinematic choreography | `steps/gsap.md` |
| UX/accessibility score before launch | `steps/ui-audit.md` |
| Deep heuristic/persona critique | `steps/critique.md` |
| Slow, janky, layout-shifting, heavy media UI | `steps/ui-optimize.md` |
| Google Stitch prompt/spec or semantic `DESIGN.md` | `resources/stitch.md` |
| Full output, no placeholders, complete component/file generation | `resources/output.md` |

## Optional Style Files

| Style intent | Load |
|---|---|
| High-end agency softness, glass, luxury, editorial mood | `styles/soft.md` |
| Quiet editorial/workspace minimalism | `styles/minimalist.md` |
| Tactical, raw, mechanical, dense Swiss/terminal look | `styles/brutalist.md` |

## Review References

For `steps/critique.md`, load these only when running the critique:

- `references/critique/heuristics-scoring.md`
- `references/critique/cognitive-load.md`
- `references/critique/personas.md`

## Operating Rules

1. Match the existing project stack, component system, tokens, and framework conventions before inventing new patterns.
2. Treat old skill names as subflow names inside this skill. For example, "use GSAP" means load `steps/gsap.md`, not a separate skill.
3. Keep design direction compact, then implement or review. Do not turn every UI task into a planning document.
4. For UI implementation, include responsive behavior, accessibility states, loading/empty/error states, and meaningful content.
5. For review-only requests, do not modify code unless the user explicitly asks for fixes.
6. For performance work, measure or inspect before changing, then report the before/after evidence that was available.
7. For animation, use the lowest motion level that makes the interface feel excellent and respect `prefers-reduced-motion`.
8. For GSAP, isolate browser-only code and clean up timelines on unmount.
9. Before finishing, check that text does not overlap or clip on mobile and desktop, and that interactive controls have focus/disabled states.
