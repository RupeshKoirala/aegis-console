# M20 · State: NgRx & SignalStore

📖 **Read first (Study Hub):** `angular-manual/m12` RxJS & signal interop · `foundations/l20` front-end architecture · `foundations/l12` design principles & patterns

One feature (alert triage: load, filter, optimistic status changes with rollback) built two ways, so you can compare them honestly.

| # | Exercise | You practise |
|---|---|---|
| 01 | Store | `createActionGroup`, `createFeature`, pure reducers, memoized selectors, `selectSignal` |
| 02 | Effects | functional effects, `switchMap` vs `mergeMap`, error handling inside, `provideMockActions` |
| 03 | SignalStore | `signalStore`, `withEntities`, `withComputed`, `withMethods`, `patchState`, `rxMethod`, `withHooks` |

### Generations
- **Gen 1:** `StoreModule.forRoot`, `@Effect()`, switch-case reducers, `store.select() | async` everywhere.
- **Gen 2:** `createFeature`, `createActionGroup`, `createEffect`, standalone providers, `ComponentStore`.
- **Gen 3 (NgRx 17–22):** `selectSignal`, functional effects, **SignalStore** (+ entities, `rxMethod`, events plugin).
