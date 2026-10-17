# M11 · RxJS & signal interop

📖 **Read first (Study Hub):** `js/l17` RxJS & observables primer · `angular-manual/m12` RxJS and signal interop · `foundations/l7` async & the event loop

**Signals** hold *state* (what is true now). **Observables** model *events over time* (keystrokes, server pushes, retries, races). Modern Angular uses both and converts at the boundary. Gen 1 code is RxJS **everywhere** (stores, HTTP, forms, router), so fluency is non-negotiable.

| # | Exercise | You practise |
|---|---|---|
| 01 | Observables from scratch | `new Observable`, teardown, cold vs hot, `error`/`complete` |
| 02 | Search-as-you-type | `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError` |
| 03 | Higher-order operators | `switchMap` vs `concatMap` vs `mergeMap` vs `exhaustMap` vs `retry`. **The** interview topic |
| 04 | Live attack stream | wrapping `EventSource` (SSE), `share`, `scan`, `bufferTime`, teardown |
| 05 | Interop | `toSignal`, `toObservable`, `takeUntilDestroyed`, migrating a Gen 1 `BehaviorSubject` store |
