# M05.01 · Host elements & attribute selectors  ⏱ 45 min

## Concepts
Every component has a **host element**: the `<aegis-stat-tile>` tag itself. You can style it, give it attributes and classes, and listen to its events, **from inside** the component:
```ts
@Component({
  selector: 'aegis-stat-tile',
  host: {
    role: 'status',                         // static attribute
    '[class.breach]': 'value() >= limit()',  // class binding on the host
    '[attr.aria-label]': 'label()',
    '(click)': 'toggle()',                   // listener on the host
  },
})
```
**Attribute selectors** let a component *enhance a native element* instead of wrapping it. You keep the real `<button>`, with its keyboard behaviour, forms and accessibility, for free:
```ts
@Component({ selector: 'button[aegisBtn]', template: `<ng-content />` })   // used as <button aegisBtn>Save</button>
```

## Generations
- **Gen 1 · v2–v15:** `@HostBinding('class.breach') get breach() { … }` and `@HostListener('click', ['$event']) onClick(e) { … }`. You'll write one of each in `legacy-stat-tile.ts`.
- **Gen 2/3:** the `host: {}` metadata object is the recommended way. It works with signals and keeps everything in one place.

## Your tasks
- `aegis-button.ts`: TODO 1–3 · `stat-tile.ts`: TODO 4 · `legacy-stat-tile.ts`: TODO 5

## Senior notes
- Don't wrap native elements (`<aegis-button><button>…</button></aegis-button>`). It breaks forms, `type="submit"`, `disabled`, focus and screen readers. Attribute selectors avoid all of that.
- A **busy** button must block clicks *before* consumers see them. Native `disabled` does that; for `aria-busy`, you have to stop the event yourself.
- Host listeners on `document`/`window`: `host: { '(document:keydown.escape)': 'close()' }`.
