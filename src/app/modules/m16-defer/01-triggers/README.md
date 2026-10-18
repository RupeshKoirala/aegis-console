# M16.01 · `@defer` triggers  ⏱ 45 min

`loadComponent` (M14.06) splits code **per route**. `@defer` splits code **inside a template**: the incident dashboard's map, chart and grid don't have to be in the bundle the analyst downloads to see the alert count.

```html
@defer (on viewport) {             <!-- WHEN to load -->
  <aegis-threat-map />             <!-- standalone components used ONLY here go to a lazy chunk -->
} @placeholder (minimum 300ms) {   <!-- before the trigger fires (must be cheap: no lazy deps) -->
  <div class="skeleton">…</div>
} @loading (after 100ms; minimum 500ms) {   <!-- while downloading; "after" avoids flashing on fast networks -->
  <p>Loading…</p>
} @error {                          <!-- the chunk failed (offline, a deploy replaced it) -->
  <p>Couldn't load</p>
}
```
| Trigger | Loads when |
|---|---|
| `on idle` (default) | the browser is idle (`requestIdleCallback`) |
| `on viewport` | the placeholder scrolls into view (IntersectionObserver) |
| `on interaction(ref)` / `on hover(ref)` | the user clicks/focuses / hovers an element |
| `on immediate` / `on timer(2s)` | right after render / after a delay |
| `when expr` | an expression becomes true, once (M16.02) |
`prefetch on …` downloads the code early, while the *render* still waits for the main trigger.

## Your tasks: `page.ts` TODO 1–3
Then `npx ng build` and look for the new **lazy chunk files** (`threat-map`, `attack-chart`…). Open `/m16/01` with the Network tab and watch them arrive.

## Senior notes
- A component referenced **anywhere else eagerly** (another template, a TS import that's used) stays in the main bundle, and `@defer` then only delays rendering. The build output is the source of truth.
- Placeholders should reserve the final **size** so content doesn't jump (Cumulative Layout Shift, a Core Web Vital).
- With SSR (M23), `@defer` blocks render their placeholder on the server, and *incremental hydration* (`hydrate on viewport`) wakes up already-rendered HTML lazily.
- The timing options are real even in tests: `@loading (minimum 500ms)` keeps the loading block up even if the error arrives sooner.
- Testing: `deferBlockBehavior: DeferBlockBehavior.Manual` + `fixture.getDeferBlocks()` + `block.render(DeferBlockState.X)`.
- **Gen 1:** lazy pieces needed a lazy *route*, or a hand-rolled `import()` + `ViewContainerRef.createComponent` (M17). **Gen 2 (v17):** `@defer`. **Gen 3:** the same, plus incremental hydration and `hydrate` triggers.
