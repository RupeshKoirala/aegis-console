# M11.05 · `toSignal`, `toObservable`, `takeUntilDestroyed`  ⏱ 40 min

You inherit a **Gen 1 alert store**: a `BehaviorSubject` service consumed with `| async` and manual `subscribe()` calls. Migrate the *component* to Gen 3, without rewriting the store (it's used in 40 other places):

```ts
readonly alerts = toSignal(this.store.alerts$, { initialValue: [] });     // Observable → Signal (auto-unsubscribes)
readonly status$ = toObservable(this.status);                             // Signal → Observable (for RxJS operators)
this.store.alerts$.pipe(takeUntilDestroyed()).subscribe(…);               // inside an injection context
```
| Gen 1 pattern | Gen 3 replacement |
|---|---|
| `alerts$ \| async` in the template | `alerts = toSignal(alerts$)` → `alerts()` |
| `private destroy$ = new Subject(); … takeUntil(this.destroy$); ngOnDestroy() { destroy$.next() }` | `takeUntilDestroyed()` |
| `@Input() set status(v) { this.status$.next(v) }` | `status = input(); status$ = toObservable(this.status)` |

## Your tasks: `alert-panel.ts` TODO 1–3

## Senior notes
- `toSignal` subscribes **immediately** (eagerly) and keeps the latest value. Without `initialValue`, the signal is `undefined` until the first emission. With `requireSync: true`, it throws if the source doesn't emit synchronously, which is handy for `BehaviorSubject`s.
- `takeUntilDestroyed()` must be called in an injection context, or passed a `DestroyRef`: `takeUntilDestroyed(this.destroyRef)`.
