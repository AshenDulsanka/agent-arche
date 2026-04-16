# Heuristics Scoring Reference

## Nielsen's 10 Usability Heuristics — Scoring Rubric

Score each heuristic 0–4. Total is out of 40.

---

### 1. Visibility of System Status

*The design always keeps users informed about what is going on, through appropriate feedback within a reasonable period of time.*

| Score | Criteria |
|-------|----------|
| 4 | Immediate feedback for all actions; loading states; progress indicators; success/error always shown |
| 3 | Good feedback but minor gaps (e.g., one action has no loading state) |
| 2 | Some feedback missing; users sometimes uncertain if their action registered |
| 1 | Minimal feedback; long operations have no progress; users frequently unsure |
| 0 | No feedback; no loading states; users cannot tell if actions succeeded |

---

### 2. Match Between System and the Real World

*The design uses words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions.*

| Score | Criteria |
|-------|----------|
| 4 | Plain language; familiar metaphors; icons with clear meaning; no jargon |
| 3 | Mostly clear with minor jargon or unfamiliar terms |
| 2 | Several unexplained technical terms or unfamiliar concepts |
| 1 | Heavy jargon; users need domain expertise to understand interface |
| 0 | Completely alien language; no connection to user's mental model |

---

### 3. User Control and Freedom

*Users often choose system functions by mistake. They need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue.*

| Score | Criteria |
|-------|----------|
| 4 | Undo available; easy exit from all flows; back navigation always clear; no traps |
| 3 | Good control with minor gaps (e.g., one flow hard to exit) |
| 2 | Some flows are traps; back navigation confusing; undo missing in important places |
| 1 | Users frequently get stuck; exits not clear; errors hard to recover from |
| 0 | No undo; no exit; users must complete or abandon flows |

---

### 4. Consistency and Standards

*Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.*

| Score | Criteria |
|-------|----------|
| 4 | Consistent visual language; same components for same purposes; follows platform patterns |
| 3 | Mostly consistent with minor visual inconsistencies |
| 2 | Some components look different in different contexts; inconsistent terminology |
| 1 | No clear visual system; same actions look different across the product |
| 0 | Completely inconsistent; no design system; every screen feels different |

---

### 5. Error Prevention

*Good design carefully prevents problems from occurring in the first place. Confirm before irreversible actions.*

| Score | Criteria |
|-------|----------|
| 4 | Destructive actions confirmed; inline validation; helpful constraints; no gotchas |
| 3 | Most dangerous actions confirmed; some validation |
| 2 | Some destructive actions without confirmation; validation missing in places |
| 1 | Users can easily make hard-to-recover mistakes with no warning |
| 0 | No error prevention; destructive actions happen immediately; no safeguards |

---

### 6. Recognition Rather Than Recall

*Minimize users' memory load by making elements, actions, and options visible.*

| Score | Criteria |
|-------|----------|
| 4 | Options visible; no reliance on memory; contextual help where needed; clear affordances |
| 3 | Mostly good with minor cases requiring recall |
| 2 | Some flows require users to remember things from other screens |
| 1 | Heavy reliance on memory; users frequently need to go back to check |
| 0 | System requires memorization of commands, sequences, or invisible options |

---

### 7. Flexibility and Efficiency of Use

*Accelerators — unseen by the novice user — may speed up interaction for the expert user.*

| Score | Criteria |
|-------|----------|
| 4 | Keyboard shortcuts; power user features; personalization; covers both novice and expert paths |
| 3 | Some shortcuts; expert paths exist but not fully developed |
| 2 | Single path for all users; no shortcuts; repetitive tasks can't be accelerated |
| 1 | No consideration for expert users; every user gets identical novice experience |
| 0 | Actively hostile to efficient use; power users disadvantaged |

---

### 8. Aesthetic and Minimalist Design

*Interfaces should not contain irrelevant or rarely needed information. Every extra unit of information competes with relevant information.*

| Score | Criteria |
|-------|----------|
| 4 | Clean; every element serves a purpose; no decoration that adds noise; excellent hierarchy |
| 3 | Good aesthetic with minor clutter or decoration |
| 2 | Noticeable clutter; several decorative elements without purpose; hierarchy unclear |
| 1 | Visual noise competes with useful content; no clear hierarchy; decorative overload |
| 0 | Chaotic; impossible to determine what's important; design actively harms usability |

---

### 9. Help Users Recognize, Diagnose, and Recover from Errors

*Error messages should be expressed in plain language, precisely indicate the problem, and suggest a solution.*

| Score | Criteria |
|-------|----------|
| 4 | Clear error messages; explains what happened; tells user what to do next |
| 3 | Good error messages but some cases vague or missing solutions |
| 2 | Error messages exist but often vague ("Something went wrong") |
| 1 | Minimal error messages; users don't know what went wrong or how to fix it |
| 0 | No error messages; failures happen silently; users completely lost |

---

### 10. Help and Documentation

*Even though it is better if the system can be used without documentation, it may be necessary to provide help.*

| Score | Criteria |
|-------|----------|
| 4 | Help available in-context; searchable docs; clear onboarding; tooltips where needed |
| 3 | Documentation exists and is mostly useful, minor gaps |
| 2 | Limited help; documentation exists but hard to find or unhelpful |
| 1 | Minimal documentation; no in-context help; users must figure it out alone |
| 0 | No help available; no documentation; no onboarding |

---

## Total Score Interpretation

| Total | Rating | Meaning |
|-------|--------|---------|
| 36–40 | Excellent | Polished, ship-ready experience |
| 28–35 | Good | Solid foundation, addressable issues |
| 20–27 | Acceptable | Works but needs targeted improvement |
| 12–19 | Poor | Core experience degraded; significant work needed |
| 0–11 | Critical | Fundamental usability failure |

## Issue Severity Scale

Tag individual issues found during heuristic evaluation:

| Level | Label | When to Use |
|-------|-------|-------------|
| **P0** | Critical | Blocks core functionality; causes significant harm |
| **P1** | High | Significantly degrades experience for many users |
| **P2** | Medium | Noticeable issue worth fixing in next iteration |
| **P3** | Low | Minor polish; low urgency |
