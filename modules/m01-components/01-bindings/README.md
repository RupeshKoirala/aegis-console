# M01.01 · Every kind of binding  ⏱ 40 min

You're building the **indicator inspector**: one indicator at a time, with keyboard navigation, a score bar and a copy button.

## Concepts
| Syntax | What it binds | Example |
|---|---|---|
| `{{ expr }}` | text | `{{ indicator().value }}` |
| `[prop]="expr"` | a DOM **property** | `[disabled]="!canEdit()"`, `[title]="desc"` |
| `[attr.x]="expr"` | an HTML **attribute** (for things that aren't properties: `aria-*`, `data-*`, `colspan`) | `[attr.aria-label]="'Copy ' + v"` |
| `[class.x]="bool"` / `[class]="expr"` | CSS classes | `[class.expired]="isExpired()"` |
| `[style.x.unit]="expr"` | inline styles | `[style.width.%]="score"` |
| `(event)="stmt"` | listen | `(click)="copy()"`, `(keydown.arrowRight)="next()"` |

**Signals 101.** State that the template shows lives in a `signal`: read it by calling `count()`, write it with `count.set(…)` or `count.update(v => …)`. A `computed(() => …)` derives a value from other signals and updates automatically. (M10 goes deep.)

**Property vs attribute:** an attribute is the initial text in HTML; a property is the live value on the DOM object. `<input value="a">` sets the attribute; typing changes the `value` property. `aria-label` has no property on most elements, so you need `[attr.aria-label]`.

## Your tasks
- `page.ts`: TODO 1–3 (signals, a computed, two event handlers)
- `page.html`: TODO 4–9 (one binding type per TODO)

## Check
`npm run ex -- m01/01`. In the app, click the inspector and use ← → to move between indicators.

## Senior notes
- Never build HTML strings yourself (`innerHTML = '<b>' + value + '</b>'`). Interpolation **escapes** its value, so a malicious indicator like `<img src=x onerror=alert(1)>` renders as text. This is your first XSS defence; M26 covers the rest.
- Template expressions should be cheap and side-effect-free. Put real work in a `computed`, which caches its result.
