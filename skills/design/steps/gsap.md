# GSAP Motion Skill

Use this subflow for high-motion interfaces. For ordinary hover, loading, route, and state transitions, use `steps/animate.md` instead.

## 1. Design Intelligence Gate

Before writing GSAP code:

1. Use `steps/direction.md` to confirm the product, audience, tone, density, and motion level.
2. Use `steps/implementation.md` for the visual system.
3. Use this subflow only if the motion should be cinematic, scroll-driven, pinned, scrubbed, or deeply choreographed.

Do not add GSAP to routine dashboards, forms, admin screens, or compliance-heavy workflows unless the user explicitly asks.

## 2. Dependency And Stack Check

Before importing GSAP:

- Check `package.json` for `gsap` and, in React projects, `@gsap/react`.
- If missing, state the install command before using the import.
- Do not mix GSAP, Framer Motion, and Three.js in one component tree without a clear separation boundary.
- In React/Next.js, isolate GSAP in a client component and clean up timelines with `gsap.context()` / `ctx.revert()` or equivalent cleanup.

## 3. Motion Architecture

Pick one primary choreography per page:

| Pattern | Use For |
|---|---|
| Pinned narrative | Product explainers, feature storytelling, campaign pages |
| Scrubbed reveal | Long-form editorial sections, before/after transformations |
| Horizontal scroll | Galleries, timelines, product collections |
| Card stack | Sequential proof, case studies, onboarding stories |
| Hero object choreography | Product launch, visual identity moment, immersive landing hero |

Support it with restrained micro-interactions. One confident system beats many unrelated animations.

## 4. Layout Rules

- Use a real visual asset or inspectable product surface for landing pages and showcases.
- Keep hero headings readable in 2-3 lines by using wide containers and responsive type.
- Use CSS Grid for bento or editorial layouts; verify no dead gaps at desktop and mobile breakpoints.
- Wrap animated pages in an overflow guard only when offscreen animation requires it.
- Avoid cheap meta labels like "SECTION 01" unless the product's brand language truly uses them.
- Button contrast must remain legible throughout animated states.

## 5. GSAP Implementation Rules

- Register plugins once in the component/module that uses them.
- Prefer `transform` and `opacity`; never animate layout properties for continuous motion.
- Use `ScrollTrigger` with explicit `start`, `end`, `scrub`, and `invalidateOnRefresh` when layout changes across breakpoints.
- Scope selectors to the component root; do not target global class names casually.
- Kill or revert timelines on unmount.
- Batch repeated reveal animations with `ScrollTrigger.batch()` or a mapped timeline.
- Recalculate measurements after images/fonts load if animation depends on dimensions.

## 6. Accessibility And Performance

- Respect `prefers-reduced-motion`: provide static layout or reduced transitions.
- Keep core content readable and reachable without animation.
- Do not block scrolling or clicks while animations run.
- Avoid scroll hijacking unless it is the explicit experience.
- Avoid infinite loops on large DOM areas; isolate looping pieces.
- Test on mobile and a narrower desktop viewport, not only wide screens.

## 7. Required Verification

Before considering GSAP work done:

- Dependency imports match installed packages.
- No server component imports browser-only GSAP code.
- Reduced-motion path works.
- Timelines clean up on unmount.
- No horizontal scroll appears unexpectedly.
- No text overlaps, clips, or becomes unreadable during scroll.
- Animated elements use stable dimensions or reserved space to avoid CLS.
- Interaction remains usable by keyboard and touch.

## 8. Output Checklist

When explaining the result, include:

- The chosen choreography pattern.
- Where GSAP is isolated.
- How reduced motion is handled.
- What was checked for layout stability and responsiveness.
