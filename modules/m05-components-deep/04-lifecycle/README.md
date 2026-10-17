# M05.04 · Lifecycle, `DestroyRef`, `afterNextRender`  ⏱ 40 min

A **hook probe** component writes every lifecycle event into a log, and the page shows the log live. Toggle the probe, change its input, and watch the order.

## The order (memorise this one, interviewers love it)
```
constructor          → inject() things. Inputs NOT set yet
ngOnChanges          → an input changed (first time: before ngOnInit). Receives SimpleChanges
ngOnInit             → once. Inputs are set: start work here
ngDoCheck            → every change detection run (rarely needed)
ngAfterContentInit   → once. Projected content is ready (contentChildren)
ngAfterContentChecked→ after every check of projected content
ngAfterViewInit      → once. Own template is ready (viewChild)
ngAfterViewChecked   → after every check of the own view
ngOnDestroy          → cleanup
```
**Gen 3 additions:**
- `inject(DestroyRef).onDestroy(fn)`: register cleanup from *anywhere* (services, helper functions), not just the class. RxJS's `takeUntilDestroyed()` uses it under the hood.
- `afterNextRender(fn)` / `afterEveryRender(fn)`: run after Angular has updated the **DOM**. Use them for DOM measurement and third-party widget setup. They never run on the server (SSR-safe).
- With signal inputs, many `ngOnChanges` uses become a `computed()` or `effect()`.

## Your tasks: `hook-probe.ts` TODO 1–4

## Senior notes
- `ngOnChanges` only fires for **input** changes made by the parent template (or `setInput`), never when the component mutates its own fields.
- Heavy work in `ngDoCheck` / `ngAfterViewChecked` runs on every change detection pass, which is a classic performance killer.
- Changing state in `ngAfterViewInit` that the view already rendered produces `NG0100 ExpressionChangedAfterItHasBeenChecked` in dev mode. Fix the data flow instead of wrapping it in `setTimeout`.
