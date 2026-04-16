---
name: shape
description: Runs a structured discovery interview and produces a design brief before any code is written. Use when about to build something new — a component, page, feature, or UI system — to align on design intent before implementation.
argument-hint: "[what you're building]"
user-invocable: true
---

Define what to build and how it should feel before writing a single line of code.

## Mandatory Preparation

Read `.github/skills/impeccable/SKILL.md` to load the design quality reference.

## Phase 1: Discovery Interview

Conduct a conversational interview to understand the design context. Don't ask all questions at once — have a natural dialogue. Ask the most important questions first, follow up on interesting answers.

### Purpose & Context
- What is this for? What problem does it solve?
- Who will use it, and when? (Power users daily? Casual visitors weekly?)
- What's the emotional goal? (Should users feel powerful? Calm? Excited? Trusted?)
- What does success look like for a user?

### Content & Data
- What content or data does it display?
- What are the key actions a user takes here?
- What's the most important thing a user should notice first?
- What's secondary? Tertiary?

### Design Goals
- Are there existing designs or components I should match?
- Any visual references you like? (Links, screenshots, descriptions)
- Any hard constraints? (Brand colors, fonts, spacing system)
- What should this look like in 5 words or less?

### Constraints
- Technical platform? (Mobile-first web, desktop app, tablet?)
- Any existing design system or tokens to follow?
- Timeline context? (Quick prototype vs. production-quality)

### Anti-Goals
- What should this NOT be? (Not flashy, not corporate, not minimalist for its own sake)
- What existing patterns are you trying to avoid?
- Are there competitor UIs that this should feel clearly different from?

Ask the user clarifying questions as needed throughout this phase.

## Phase 2: Design Brief

After the interview, synthesize findings into a structured Design Brief. Present the brief for confirmation before finishing.

---

### Design Brief: [Component/Feature Name]

**1. Feature Summary**
One-paragraph description of what this is, what it does, and who uses it.

**2. Primary User Action**
The single most important thing a user should be able to do here. Everything else is secondary.

**3. Design Direction**
The intended aesthetic and emotional quality:
- Visual character: (e.g., "calm and professional", "bold and confident", "warm and approachable")
- Key tension resolved: (e.g., "information-dense but not overwhelming")
- 3–5 adjectives that describe the desired feel

**4. Layout Strategy**
How content should be structured spatially:
- Information hierarchy (what's most visible, what's least)
- Layout pattern (card grid, master-detail, single column, sidebar + content)
- Density approach (compact for power users? spacious for casual visitors?)

**5. Key States**
List the UI states that must be designed:
- [ ] Default / empty
- [ ] Loading / skeleton
- [ ] Populated / active
- [ ] Error / failure
- [ ] Success / confirmation
- [ ] Disabled / locked
- [ ] Hover / focus
- [Other states specific to this UI]

**6. Interaction Model**
How the interface responds to user action:
- Primary interactions (click, tap, drag)
- Key microinteractions (what provides feedback)
- Transitions (how state changes feel)
- Any animations needed and their purpose

**7. Content Requirements**
What content must be present at minimum:
- Required elements (heading, CTA, image, etc.)
- Content types (text length, media types, structured data)
- Edge cases (empty state, very long text, many items)

**8. Recommended References**
3–5 UI patterns, components, or sites worth studying for this design:
- [Reference 1] — what to draw from it
- [Reference 2] — what to draw from it
- [Reference 3] — what to draw from it

**9. Open Questions**
Unresolved decisions that will need answers during implementation:
- [Question 1]
- [Question 2]

---

Confirm: "Does this brief capture what you're building? Should I adjust anything before we begin implementation?"

**This skill produces only a design brief — no code is written during shape.**

The brief can be handed to `impeccable` for full implementation, or used as a reference for any code-writing task.

**NEVER**:
- Write code during the shape phase
- Skip the confirmation step (alignment before implementation saves time)
- Make assumptions about aesthetic direction (ask, don't guess)
- Create a brief with vague direction ("modern design") — push for specificity
- Forget edge cases in Key States section
