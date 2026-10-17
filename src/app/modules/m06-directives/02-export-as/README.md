# M06.02 · `exportAs`: template-visible directive state  ⏱ 25 min

Analysts copy indicators all day. The `[aegisCopy]` directive copies a value when its host is clicked and keeps a `copied` flag for two seconds. **`exportAs`** lets the template read that flag through a reference variable:
```html
<button [aegisCopy]="ind.value" #c="aegisCopy">{{ c.copied() ? '✓ Copied' : 'Copy' }}</button>
```
Without `exportAs`, `#c` would point at the `<button>` element, not the directive. You've already used this pattern: `#form="ngForm"` in M03.02.

## Your tasks: `copy.directive.ts` TODO 1–3, `page.ts` TODO 4

## Senior notes
- Clipboard writes need a user gesture and a secure context (https or localhost), and they can fail. Always `.catch()`.
- Timers in directives must be cleared on destroy (`DestroyRef`), or a destroyed row will try to update itself 2 s later.
