# M01.04 · Outputs & `model()`  ⏱ 45 min

**Threat triage**: a severity filter (two-way bound) and a list of rows that ask the parent to remove them or select them.

## Concepts
Data flows **down** through inputs and events flow **up** through outputs. The parent owns the state, so the child never edits it; it *asks*.
```ts
// child
picked = output<IndicatorView>();               // Gen 3
pick() { this.picked.emit(this.indicator()); }
// parent template
<aegis-indicator-row [indicator]="i" (picked)="onPicked($event)" />     // $event = the emitted value
```
**`model()`** is an input and an output in one, which gives you two-way binding:
```ts
selected = model<Severity[]>([]);                // child: this.selected.set([...]) notifies the parent
<aegis-severity-filter [(selected)]="severities" />   // parent: severities is a writable signal
```
Under the hood, `[(selected)]` is sugar for `[selected]="severities()" (selectedChange)="severities.set($event)"`.

## Generations
- **Gen 1 · v2–v16:** `@Output() removeRequested = new EventEmitter<number>();` then `this.removeRequested.emit(id)`. Two-way binding needed an `@Input() x` **plus** an `@Output() xChange` pair, and you see that pattern everywhere.
- **Gen 2 · v17.1–v18:** `output()` and `model()` arrive (developer preview), and become stable in v19.
- **Gen 3 · v22:** `output()` / `model()`. Use `outputFromObservable()` when the source is RxJS.

## Your tasks
- `severity-filter.ts`: TODO 1–2 · `indicator-row.ts`: TODO 3–4 · `legacy-row.ts`: TODO 5 · `page.ts`: TODO 6 · `page.html`: TODO 7–9

## Check
`npm run ex -- m01/04`. Toggle CRITICAL/HIGH, pick a row, and remove one.

## Senior notes
- Name outputs after **what happened** (`picked`, `removeRequested`), not after the DOM event (`click`). Never name one `click`, because it collides with the native event and fires twice.
- Event emission is synchronous: `emit()` runs the parent handler immediately, before `emit()` returns.
- If two siblings need the same state, lift it to the common parent (this exercise), or move it into a service (M01.06).
