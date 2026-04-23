# Svelte Rules

Svelte 5 runes only. These rules apply to every `.svelte` component file.

## Component Structure
Always in this order:
1. `<script lang="ts">` block
2. Markup (HTML template)
3. `<style>` block (only when component-scoped styles are unavoidable — prefer utility classes)

## Props — $props() rune
```svelte
<script lang="ts">
  const { label, count = 0 }: { label: string; count?: number } = $props();
</script>
```
- Never use `export let` — that is Svelte 4 syntax
- Always type props inline with the destructure

## Reactivity
```svelte
let count = $state(0);
const doubled = $derived(count * 2);
$effect(() => { /* side effects when reactive state changes */ });
```
- Never use `$:` reactive declarations — use `$derived` (sync computed) or `$effect` (side effects)
- `$effect` runs after DOM updates, not synchronously

## Event Handlers
```svelte
<button onclick={handleClick}>Click</button>
<input oninput={handleInput} />
```
- Never use `on:event` directive syntax — that is Svelte 4
- All event handlers use the `onevent` attribute

## Naming and Files
- Component files: `PascalCase.svelte`
- Props: `camelCase`
- Emitted events: `camelCase`

## Accessibility
- All images: `alt` text required (empty string `alt=""` only for decorative images)
- All form inputs: associated `<label>` elements
- Icon-only interactive elements: `aria-label`
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>`) — not `<div onclick>`
- Every interactive element must be keyboard-accessible with a visible focus ring

## Do Not
- Do not use `onMount`, `onDestroy`, `beforeUpdate`, `afterUpdate` without importing from `svelte`
- Do not use Svelte 4 lifecycle unless a clear comment explains why runes are insufficient
- Do not directly mutate arrays/objects stored in `$state` — reassign to trigger reactivity
