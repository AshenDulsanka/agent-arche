---
paths:
  - "**/*.svelte"
---

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
