# M01.02 · Control flow: `@for` `@if` `@switch` `@let`  ⏱ 45 min

The **indicator table**: filter by list kind, numbered and striped rows, a detail panel, and a "nothing here" state.

## Concepts
```html
@for (item of items(); track item.id; let i = $index, last = $last) {
  <tr [class.odd]="$odd">{{ i + 1 }}. {{ item.value }}</tr>
} @empty {
  <tr><td>No indicators</td></tr>
}
```
- `track` is **required**. It tells Angular which DOM row belongs to which item, so it can **move** rows instead of destroying and recreating them. Track by a stable id. `track $index` is only fine for static lists.
- Implicit variables: `$index $first $last $even $odd $count`.

```html
@if (selected(); as s) { …use s… } @else if (loading()) { … } @else { … }
@switch (kind) { @case ('ALLOW') { … } @case ('BLOCK') { … } @default { … } }
@let total = visible().length;          <!-- a local, read-only template variable -->
```

## Your tasks: all in `page.html` (TODO 1–6)
`page.ts` is done. Read it first: `kindFilter`, `visible`, `selected` and `select()`.

## Check
`npm run ex -- m01/02`. Click the kind filters; **ALLOW + "only scored"** should show the empty state.

## Senior notes
- Use `@if (x(); as x)` so you call a signal **once**, and so the type is narrowed inside the block (no `x()!`).
- The `track` expression matters for performance *and* correctness: tracking by index reuses a row's DOM, including focus and `<input>` text, for a *different* item after you sort.
- The old `*ngFor` needed `trackBy: fn` to get the same behaviour, and most legacy code forgot it. You'll see that in M01.05.
