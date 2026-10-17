# M10.02 · `linkedSignal`  ⏱ 35 min

**List picker + indicator panel.** You choose a list on the left, and the right side shows its indicators with one selected.
- When you switch lists, the selection must **reset** to the first indicator of the new list.
- But the analyst must also be able to **select** one themselves, so it has to be writable.
- And when the list is merely *re-filtered*, keep the selection if it's still visible.

`computed` can't be written to. A `signal` plus an `effect` that resets it is the classic anti-pattern: an extra render, a glitch, and an ordering bug. **`linkedSignal`** is exactly "writable, but reset when the source changes":
```ts
selected = linkedSignal<IndicatorView[], IndicatorView | null>({
  source: this.visible,
  computation: (items, previous) =>
    previous && items.some(i => i.id === previous.value?.id) ? previous.value : items[0] ?? null,
});
// shorthand when you don't need `previous`:
page = linkedSignal(() => { this.query(); return 0; });   // reset paging to 0 whenever the query changes
```

## Your tasks: `page.ts` TODO 1–2

## Senior notes
- Reach for `linkedSignal` whenever you catch yourself writing `effect(() => this.x.set(...))`.
- Server-driven defaults are another classic use: the form starts at the saved value, the user edits it, and it resets when a different record loads.
