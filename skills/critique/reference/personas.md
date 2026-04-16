# Personas Reference

## Five Core Testing Personas

Use these personas to evaluate interfaces from different user perspectives. Select 2–3 relevant personas for each critique.

---

### Alex — Power User

**Profile**:
- Uses the product daily, multiple times
- Knows it well; has mental models and habits
- Values speed, efficiency, keyboard shortcuts
- Gets frustrated by repetition, extra clicks, no keyboard navigation

**Behaviors**:
- Skips onboarding (already knows the product)
- Uses keyboard shortcuts whenever possible
- Multi-tasks with multiple tabs or windows open
- Notices when something that worked before now works differently

**Test Questions**:
- Can I complete the primary flow in the minimum possible steps?
- Are there keyboard shortcuts for frequent actions?
- Does the interface respect my time or slow me down?
- Have recent changes broken my existing habits?

**Red Flags**:
- Required confirmation dialogs for routine actions
- No keyboard shortcuts for repeated tasks
- Mandatory onboarding that can't be skipped
- Important features buried two menus deep

---

### Jordan — First-Timer

**Profile**:
- Has never used this product before (or anything like it)
- Unfamiliar with domain terminology
- Relies entirely on the interface to guide them
- Makes decisions based on what's visible, not what's hidden

**Behaviors**:
- Reads labels carefully
- Pauses before clicking uncertain elements
- Looks for cues that indicate what's interactive
- Gives up quickly if confused or stuck

**Test Questions**:
- Does the product explain itself without a manual?
- Can I reach success on my first try without help?
- Are there any words I wouldn't understand?
- Do I know what to do when I land on the page?

**Red Flags**:
- Technical jargon without explanation
- No clear call-to-action on first arrival
- Empty states without guidance
- Actions with non-obvious consequences
- No error messages that explain what went wrong

---

### Sam — Accessibility User

**Profile**:
- Uses a screen reader (VoiceOver, NVDA)
- Or uses only a keyboard (can't or won't use mouse)
- Or has low vision (uses browser zoom, high contrast mode)
- Or has motor differences (uses switch control, large targets)

**Behaviors**:
- Navigates by Tab key
- Relies on ARIA labels and semantic HTML
- Uses browser zoom to 200%
- May use voice control

**Test Questions**:
- Can I complete all primary tasks without a mouse?
- Does focus move in a logical order when I press Tab?
- Do interactive elements have meaningful labels?
- Are error messages announced to screen readers?

**Red Flags**:
- Focus indicator not visible (`:focus` styles removed)
- Interactive elements without labels (`aria-label` missing)
- Images without alt text
- Keyboard traps (can't Tab out of a modal)
- Color-only information (no shape or text alternative)
- Touch targets below 44px
- Auto-playing audio/video
- Content that appears only on hover (keyboard inaccessible)

---

### Riley — Stress Tester

**Profile**:
- Uses the product in difficult conditions
- Slow internet, old device, poor lighting, in a hurry
- Enters unexpected inputs (very long text, unusual characters, empty fields)
- Tests edge cases that product teams often miss

**Behaviors**:
- Submits forms with edge-case data
- Double-clicks buttons rapidly
- Navigates using browser back button
- Switches tabs mid-task
- Loses connection and returns

**Test Questions**:
- What happens when I submit an empty form?
- What happens when I enter 500 characters in a field expecting 50?
- What happens when I click a button twice quickly?
- What happens if my connection drops mid-upload?
- Does the back button do what I expect?

**Red Flags**:
- Duplicate form submissions on double-click
- No character limits shown (only enforced after submission)
- Generic error messages ("Something went wrong")
- No loading/disabled state on submit buttons
- Data loss when navigating away unexpectedly

---

### Casey — Distracted Mobile

**Profile**:
- Using a phone on the go (commuting, holding something, multitasking)
- One hand, thumb only
- Small screen, may have poor signal
- Interrupted mid-task
- Time-pressured

**Behaviors**:
- Scrolls quickly, reads little
- Taps approximate locations (fat-finger problem)
- Leaves app and comes back later
- Gets notifications that interrupt flow

**Test Questions**:
- Can I complete the primary action with one hand?
- Do touch targets feel comfortable to hit?
- If I come back to this in 10 minutes, can I continue where I left off?
- Does the page load on a slow connection?

**Red Flags**:
- Important actions only reachable at top of screen
- Touch targets under 44px
- No progress saved for multi-step flows
- Text too small to read without zooming
- Too much information competing for attention

---

## Persona Selection Guide

| Interface Type | Recommended Personas |
|----------------|---------------------|
| Consumer mobile app | Casey, Jordan, Sam |
| B2B SaaS product | Alex, Riley, Sam |
| E-commerce checkout | Jordan, Casey, Riley |
| Admin dashboard | Alex, Sam, Riley |
| Public website | Jordan, Casey, Sam |
| Form-heavy UI | Riley, Jordan, Sam |
| Data visualization | Alex, Sam, Jordan |

## Project-Specific Personas

For products with a documented user base, generate project-specific personas from your `copilot-instructions.md` Design Context. These should supplement (not replace) the core 5 personas above.

A project-specific persona includes:
- Real job title and workflow context
- Specific goals within the product
- Known pain points from user research
- Primary device and environment
