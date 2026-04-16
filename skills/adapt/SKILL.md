---
name: adapt
description: "Adapts a UI for a different context, device, or format — mobile, tablet, desktop, print, or email. Use when the interface works in one context but needs to work well in another."
argument-hint: "[target context: mobile | tablet | desktop | print | email]"
user-invocable: true
---

Adapt an existing interface to work beautifully in a different context.

## Mandatory Preparation

Read `.github/skills/impeccable/SKILL.md` and `reference/responsive-design.md` for the responsive design reference.

## Assess Adaptation Needs

Understand the gap between current state and target context:

**Source context**: What does the current design assume?
- Device type (desktop-first? mobile-first?)
- Input method (mouse? keyboard? touch?)
- Screen size and resolution
- Connection quality
- Usage context (focused task? quick glance? reading?)

**Target context**: What are the new constraints and opportunities?

**Key challenges**: What specifically will break or feel wrong in the new context?

## Mobile Adaptation

When adapting for phones (320px–767px):

**Layout**:
- Single column content flow
- Stack horizontally-arranged elements
- Sidebar → collapsed menu or bottom sheet
- Tables → card-based vertical layout or horizontal scroll
- Multi-column grids → single column or 2-column max

**Touch Targets**:
```css
/* Minimum 44×44px for all interactive elements */
.button, a, input, select {
  min-height: 44px;
  min-width: 44px;
}

/* Add spacing between close touch targets */
.list-item + .list-item {
  margin-top: 8px;
}
```

**Navigation**:
- Top nav → hamburger menu or bottom tab bar
- Bottom navigation for 4–5 primary destinations (thumb-friendly)
- Back button always accessible
- Avoid deeply nested navigation

**Thumb-First Design**:
- Primary actions in the bottom third of the screen
- Avoid actions in the dead zone (top corners on large phones)
- Swipe gestures for frequent actions
- FAB (Floating Action Button) for the primary action

**Progressive Disclosure**:
- Show less by default, expand on demand
- Accordion patterns for secondary information
- "See more" progressively reveals content
- Modals only for important decisions (not content display)

**Optimize for slow connections**:
- Skeleton screens instead of spinners
- Below-fold images lazy loaded
- Inline critical data fetchong above the fold
- Offline fallbacks for frequently used data

## Tablet Adaptation

When adapting for tablets (768px–1023px):

**Layout**:
- Two-column layouts work well
- Master-detail: left panel + right content
- Some multi-column content can persist
- Navigation can be persistent side panel at larger tablet sizes

**Orientation-Adaptive**:
```css
@media (orientation: landscape) and (max-width: 1023px) {
  .sidebar {
    width: 280px; /* Narrow sidebar in landscape */
  }
}

@media (orientation: portrait) and (max-width: 1023px) {
  .sidebar {
    display: none; /* Hidden by default in portrait */
  }
}
```

**Mixed Input**:
- Support both touch and keyboard
- Hover states still useful (external keyboard common)
- Touch targets remain 44px
- Drag and drop is possible but secondary

## Desktop Adaptation

When adapting for desktop (1024px+):

**Layout**:
- Multi-column with persistent navigation
- Sidebar always visible (no toggle needed)
- Content can be information-dense
- Use screen real estate purposefully (don't just stretch cards wider)
- Max-width container prevents over-stretching

```css
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}
```

**Hover States**:
- Hover reveals secondary actions
- Tooltips on icon-only buttons
- Hover previews for cards
- Cursor changes indicate interactivity

**Keyboard Navigation**:
- Full keyboard navigation for all flows
- Visible focus indicators (not just browser defaults)
- Keyboard shortcuts for power users
- Skip navigation links

**Advanced Interactions**:
- Drag and drop where appropriate
- Keyboard shortcuts for frequent actions
- Right-click context menus
- Multi-select with shift/cmd click
- Resizable panels

## Print Adaptation

When adapting for print (`@media print`):

```css
@media print {
  /* Hide non-content elements */
  nav, header, footer, .sidebar, .button, .ad, .modal {
    display: none !important;
  }

  /* Optimize for ink */
  body {
    background: white;
    color: black;
    font-size: 12pt;
  }

  /* Expand links to show URLs */
  a::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
    color: #666;
  }

  /* Control page breaks */
  h1, h2, h3 {
    page-break-after: avoid;
  }

  .card, .section {
    page-break-inside: avoid;
  }

  /* Remove shadows and gradients (waste of ink) */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
```

## Email Adaptation

When adapting for email clients:

**Constraints**:
- 600px max width (many clients don't support wider)
- Single column (two columns only for simple cases)
- No CSS Grid (poor support)
- Minimal Flexbox (limited support)
- No CSS animation (ignored by most clients)
- No `<style>` blocks in `<head>` (many clients strip them)
- Use inline CSS for critical styles
- Tables for layout (not ideal but still most reliable)

**Structure**:
```html
<!-- Email-safe structure -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding: 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
      <!-- Content -->
    </td>
  </tr>
</table>
```

**Typography**:
- Web-safe fonts (Arial, Helvetica, Georgia, Times New Roman)
- Or font stack with web-safe fallback: `font-family: 'Inter', Arial, sans-serif`
- Body text 16px minimum, headings clear hierarchy
- Sufficient contrast (render on white)

**Images**:
- Always include `alt` text (images often blocked)
- Set explicit `width` and `height`
- Use `max-width: 100%` for fluid images

**CTAs**:
- Large, clearly visible buttons
- Minimum 44px height
- High-contrast colors (no transparency)
- Use VML or table-based buttons for Outlook

## Breakpoints

Content-driven breakpoints (not device-driven):

```css
/* Mobile first */
.component { /* styles for 320px+ */ }

/* Small tablet */
@media (min-width: 640px) { .component { /* 2 columns */ } }

/* Tablet */  
@media (min-width: 768px) { .component { /* 3 columns */ } }

/* Small desktop */
@media (min-width: 1024px) { .component { /* sidebar visible */ } }

/* Large desktop */
@media (min-width: 1280px) { .component { /* max-width container */ } }
```

Use `min-width` for mobile-first (build up, not down).

## Verify Adaptation Quality

- **Real device testing**: Test on actual devices, not just DevTools emulation
- **Touch testing**: Can every action be completed with a finger?
- **Keyboard testing**: Tab through the entire flow
- **Content testing**: Does all content survive the layout change?
- **Performance testing**: Mobile loading on throttled 3G
- **Context testing**: Does it feel native to the target context?

**NEVER**:
- Adapt for mobile as an afterthought (mobile users are often majority)
- Break desktop functionality while fixing mobile
- Use 100vw with overflow hidden (causes scroll issues)
- Forget to test with real content (design with real data, not Lorem Ipsum)
- Ignore keyboard and screen reader testing for desktop
- Use pixels for media queries (always use em or rem for user font-size respecting)
