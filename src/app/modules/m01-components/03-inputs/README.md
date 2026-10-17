# M01.03 · Inputs: signal & decorator  ⏱ 45 min

A reusable **indicator card**, written twice: the v22 way, and the way that fills most existing codebases.

## Concepts (Gen 3 · v22)
```ts
export class IndicatorCard {
  indicator = input.required<IndicatorView>();                  // the parent MUST pass it
  listKind  = input.required<ListKind>({ alias: 'kind' });      // the public name is "kind": <x [kind]="…">
  compact   = input(false, { transform: booleanAttribute });   // <x compact> works: "" → true
  maxDescription = input(60, { transform: numberAttribute });  // <x maxDescription="20"> works: "20" → 20
  short = computed(() => this.indicator().description?.slice(0, this.maxDescription()));
}
```
Inputs are **read-only signals**: read `indicator()`, and never `.set()` them (the parent owns the value). Derived values go in `computed()`, which recalculates whenever an input changes.

## Gen 1 · v2–v15 (you'll write this too, in `legacy-indicator-card.ts`)
```ts
@Input({ required: true }) indicator!: IndicatorView;    // required: true needs v16+
@Input('kind') listKind!: ListKind;                       // alias as the first argument
@Input({ transform: booleanAttribute }) compact = false;  // transform needs v16.1+
ngOnChanges(changes: SimpleChanges) { … }                 // recompute derived values when inputs change
```
**Gen 2 · v16–v17.0:** `required` and `transform` were added to `@Input`. Signal `input()` arrived in v17.1 and became stable in v19.

## Your tasks
1. `indicator-card.ts`: TODO 1–4. Turn the placeholder signals into real inputs, and finish `shortDescription`.
2. `legacy-indicator-card.ts`: TODO 5–7. Add the `@Input`s and an `ngOnChanges`.
3. `page.html`: TODO 8–9. Render both cards.

## Check
`npm run ex -- m01/03`. Change `maxDescription` in `page.html` and watch the descriptions shrink.

## Senior notes
- Prefer `input.required()` whenever the component can't work without the value. Then a missing binding fails **at build time** instead of rendering `undefined`.
- `ngOnChanges` only fires when the **reference** changes. Mutating an object the parent passed in (`indicator.score = 5`) won't trigger it, and won't re-render under OnPush either. That's the root of countless "my child doesn't update" bugs. Treat inputs as immutable.
- Don't name an input `id`, `title` or `hidden`, because they shadow native DOM properties.
