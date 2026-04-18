---
name: critique
description: Provides a deep dual-assessment design critique combining AI design review with manual pattern analysis. Use when the user wants expert design feedback, heuristic evaluation, or a thorough UX critique.
argument-hint: "[component, page, or screenshot to critique]"
user-invocable: true
---

Deliver expert-level design critique through structured heuristic evaluation and cognitive load analysis.

## Mandatory Preparation

1. Read `.github/skills/design/SKILL.md` to load the full design quality reference system and anti-pattern catalogue.
2. Read `critique/reference/heuristics-scoring.md` for the 10-heuristic scoring rubric.
3. Read `critique/reference/cognitive-load.md` for cognitive load analysis framework.
4. Read `critique/reference/personas.md` for persona-based testing.

## Step 1: Gather Context

Before critiquing, understand intent:

- What is this interface for? What's the primary user action?
- Who are the intended users?
- What stage is the design at? (Early exploration? Pre-launch polish?)
- What are the known pain points or open questions?
- What should I focus on? (Specific flows? Overall polish? Accessibility?)

## Step 2: Dual Assessment

Run both assessments before writing the combined report.

### Assessment A: LLM Design Review

**AI Slop Detection — Check for these patterns first:**
- Generic hero sections (gradient + centered text + two buttons)
- Card grids with identical visual weight
- Oversaturated gradients from purple to blue/teal
- Every section a different background color
- Hover states appearing from nowhere (no affordance)
- Icons used as pure decoration with zero function
- Centered text everywhere (even for long-form content)
- Filler placeholder content that was never replaced

**Heuristics Evaluation** (score each 0–4 using `reference/heuristics-scoring.md`):
1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, recover from errors
10. Help and documentation

**Cognitive Load Analysis** (using `reference/cognitive-load.md`):
- Intrinsic load: Is the task complexity appropriate?
- Extraneous load: Is design adding unnecessary complexity?
- Germane load: Is the interface teaching users well?
- Count violations from the 8 cognitive load checklist items

**Emotional Journey**:
- First impression (0–1 second)
- Onboarding experience
- Moment of value delivery
- Error/friction moments
- Returning user experience

**Persona Testing** (select 2–3 relevant personas from `reference/personas.md`):
- Test primary flow as each persona
- Identify where each persona would struggle
- Note persona-specific red flags

### Assessment B: Manual Code Review

Note: The automated CLI scanner is not available in this environment. Pattern detection relies on manual code review.

Review the code or UI for:
- Design system usage (tokens vs. arbitrary values)
- Component consistency (do similar things look the same?)
- Anti-pattern inventory (dark patterns, visual noise, broken feedback)
- Accessibility in markup (ARIA, alt text, keyboard, contrast)
- Responsive implementation quality

## Step 3: Combined Report

### Heuristics Scorecard

| # | Heuristic | Score /4 | Key Issue |
|---|-----------|----------|-----------|
| 1 | Visibility of system status | | |
| 2 | Match between system and real world | | |
| 3 | User control and freedom | | |
| 4 | Consistency and standards | | |
| 5 | Error prevention | | |
| 6 | Recognition rather than recall | | |
| 7 | Flexibility and efficiency of use | | |
| 8 | Aesthetic and minimalist design | | |
| 9 | Help with errors | | |
| 10 | Help and documentation | | |
| | **Total** | **/40** | |

### Anti-Patterns Verdict
State immediately whether anti-patterns were found: category, severity, impact.

### Overall Impression
2–3 sentence honest summary of the design quality.

### What's Working
3–5 genuine strengths. Be specific — don't invent praise.

### Priority Issues

**P0 — Critical** (blocks use or causes harm):
- [Issue] — [Evidence] — [Impact]

**P1 — High** (significantly degrades experience):
- [Issue] — [Evidence] — [Impact]

**P2 — Medium** (noticeable, worth fixing):
- [Issue] — [Evidence] — [Impact]

**P3 — Low** (polish opportunities):
- [Issue] — [Evidence] — [Impact]

### Persona Red Flags
Issues that would specifically harm specific user groups.

### Cognitive Load Summary
- Score: X/8 checklist items met
- Biggest cognitive load sources
- Where users are most likely to abandon

### Minor Observations
Non-critical polish items and opportunities.

## Step 4: Ask Targeted Questions

After presenting findings, ask 2–4 targeted questions that:
- Clarify constraints you're unsure about
- Explore trade-offs where there's no obvious right answer
- Uncover business or technical constraints that affect recommendations

Examples:
- "Is there a reason X works this way — is that a technical or business constraint?"
- "Are you targeting first-time users, returning power users, or both?"
- "What's the most common support request or user complaint you've heard?"

## Step 5: Recommended Actions

Provide an ordered action plan using the available skills:

1. **Fix P0 issues first** — specific actions
2. **Address P1 issues** — suggest `audit` or targeted skills
3. **Improve weak heuristics** — suggest `layout`, `typeset`, `polish`
4. **Visual quality pass** — end with `polish`

Reference available skills: `polish, animate, optimize, audit, critique, layout, typeset, shape, adapt`

**NEVER**:
- Invent positive feedback (be honest, even if it's hard)
- Skip structured scoring (the rubric creates accountability)
- Make recommendations without referencing specific evidence
- Use vague language ("this seems off") without explaining the heuristic or principle violated
- Forget to ask questions (critique is a conversation, not a monologue)
- Omit cognitive load analysis (it's often where the biggest issues hide)
