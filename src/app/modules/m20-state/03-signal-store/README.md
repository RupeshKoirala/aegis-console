# M20.03 · NgRx SignalStore  ⏱ 50 min

Same feature, a third of the code. **SignalStore** keeps NgRx's discipline (state changes in one place, immutably) but drops the action/reducer/effect ceremony:

```ts
export const AlertTriageStore = signalStore(
  withEntities<Alert>(),                                   // entities(), entityMap(), ids() + setAllEntities/updateEntity…
  withState({ filter: 'ALL' as StatusFilter, loading: false }),
  withComputed(({ entities, filter }) => ({ visible: computed(() => …) })),
  withMethods((store, http = inject(HttpClient)) => ({
    setFilter(filter: StatusFilter) { patchState(store, { filter }); },
    load: rxMethod<void>(pipe(switchMap(() => http.get(…).pipe(tap(…))))),
  })),
  withHooks({ onInit: store => store.load() }),
);
// providers: [AlertTriageStore] on the page: created with the page, destroyed with it
```

## Your tasks: `triage.store.ts` TODO 1–3

## Which one when? (a classic architecture question)
| | Global `Store` + effects (01–02) | SignalStore (03) | Plain service + signals (angular-3day ex13) |
|---|---|---|---|
| Scope | app-wide, cross-feature | feature/page (or root) | small features |
| Debugging | Redux DevTools, action log, time travel | `withDevtools` (ngrx-toolkit) | console |
| Ceremony | most | little | least |
| Team scale | large teams, strict conventions | most new code | prototypes / simple pages |

## Senior notes
- `patchState` is the only way to write. State outside the store is read-only signals, so the discipline is enforced by types.
- `rxMethod` accepts a value, a signal or an observable. Pass a signal (`store.load(this.tenantId)`) and it reloads when the tenant changes.
- Entities (`withEntities`) give O(1) lookups by id (`entityMap()`) and correct immutable updates. Hand-written `map(a => a.id === id ? …)` gets error-prone with nested collections.
- **Gen 1:** `@ngrx/component-store` (`ComponentStore` with `updater`/`effect`). **Gen 2:** the same with `selectSignal`. **Gen 3 (v17+):** `@ngrx/signals`, the successor to ComponentStore.
