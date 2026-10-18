# M16.02 · `@defer` with conditions, in lists, on a timer  ⏱ 35 min

The alert queue shows **many** alerts, but an analyst opens the details of only a few. Deferring per row means the details component (and whatever enrichment it pulls in) loads once, on first use, and renders only for the rows actually opened.

```html
@defer (when showAdvanced()) { <aegis-advanced-filters /> }      <!-- a signal/expression, ONE-WAY: once true, it stays loaded -->

@for (a of alerts; track a.id) {
  <button #more>details</button>
  @defer (on interaction(more)) { <aegis-alert-details [alert]="a" /> }   <!-- each row = its own defer block -->
  @placeholder { <span></span> }
}

@defer (on timer(3s)) { <aegis-related-feeds /> }               <!-- "below the fold, not urgent" -->
```

## Your tasks: `page.ts` TODO 1–3

## Senior notes
- `when` is **one-way**: unticking the box does *not* unload the filters. If you need hide/show *after* loading, put an `@if` inside the `@defer`.
- The chunk downloads **once** for all rows. Every later row just renders.
- `on interaction(more)` inside `@for` refers to *that iteration's* `#more`. Template references are scoped to the embedded view.
- Don't defer what's above the fold and visible on load: you'd only add a flash and an extra request. Defer heavy, below-the-fold, rarely-used things.
- Interview question: *"`@defer` vs `@if`?"* `@if` toggles rendering of code that's already downloaded. `@defer` decides **when the code is downloaded** (and renders it then).
