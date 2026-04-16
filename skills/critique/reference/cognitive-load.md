# Cognitive Load Reference

## Three Types of Cognitive Load

### Intrinsic Load
The inherent complexity of the task itself. Cannot be eliminated, only managed.
- Designing complex analytics? The data is complex — that's intrinsic.
- Goal: Help users build accurate mental models of the task.

### Extraneous Load
Unnecessary complexity added by poor design. Always eliminate this.
- Confusing labels, inconsistent patterns, visual noise, unnecessary steps.
- Goal: Remove everything that doesn't serve the user's goal.

### Germane Load
The productive mental effort used to learn and build skills.
- First-time users learning a new pattern.
- Goal: Support this with good affordances and feedback.

## Cognitive Load Checklist

Rate the interface against each item:

- [ ] **Single Focus**: Each screen/view has one clear primary action
- [ ] **Chunking**: Related information grouped (≤4 items per group before breaking into sections)
- [ ] **Grouping**: Visual proximity communicates relationships
- [ ] **Visual Hierarchy**: Important information stands out without effort
- [ ] **One Thing at a Time**: Users aren't asked to do two things simultaneously
- [ ] **Minimal Choices**: Decision points have ≤4 options (or progressive disclosure)
- [ ] **Working Memory**: No more than 4 things must be held in memory at once
- [ ] **Progressive Disclosure**: Advanced features hidden until needed

## Working Memory Rule

**Limit: ≤4 items at decision points**

Humans can hold approximately 4 chunks in working memory. More than 4 options at a decision point forces users to work harder than necessary.

Signs of working memory overload:
- Navigation with 8+ top-level items
- Forms with many required fields visible at once
- Tables with 10+ columns
- Modal dialogs requiring cross-reference with other information

## 8 Common Cognitive Load Violations

### 1. Wall of Options
Everything is visible and equally prominent. Users can't identify what matters.
- **Fix**: Establish clear hierarchy. One primary action, secondary actions reduced.

### 2. Memory Bridge
User must remember information from one screen to use on another.
- **Fix**: Show the relevant information on the current screen. Don't require memory.

### 3. Hidden Navigation
Users can't figure out how to get back or where else they can go.
- **Fix**: Breadcrumbs, persistent navigation, clear back affordances.

### 4. Jargon Barrier
Technical terms, unexplained acronyms, or domain language that first-timers don't know.
- **Fix**: Plain language. Tooltips for unavoidable technical terms. Explain before using.

### 5. Visual Noise Floor
So much is happening visually that important content is lost in the chaos.
- **Fix**: Reduce decorative elements. Whitespace creates signal. Remove vs. style.

### 6. Inconsistent Pattern
Same action looks different in different parts of the interface. Users can't build patterns.
- **Fix**: Consistent components. One way to do each thing.

### 7. Multi-Task Demand
Users must attend to multiple things simultaneously (e.g., read instructions while filling forms).
- **Fix**: Inline help. Step-by-step flows. Don't split attention.

### 8. Context Switch
Users must leave their current context to get information they need to continue.
- **Fix**: Bring the information to the user. Don't send them away.

## Cognitive Load Scoring

Count checklist items met (0–8):

| Score | Assessment |
|-------|------------|
| 7–8 | Low cognitive load — excellent |
| 5–6 | Moderate load — some friction |
| 3–4 | High load — noticeable struggle |
| 0–2 | Severe load — users likely abandon |
