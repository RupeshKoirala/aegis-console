# M20.01 · NgRx store: actions, reducer, selectors  ⏱ 60 min

Alert triage touches many screens: the queue, the header badge ("7 new"), the dashboard, the tenant switcher (which must reset it). When state is shared that widely and changes from many places, NgRx gives you **one immutable state tree, changed only by actions through pure reducers, read through memoized selectors**, and a time-travel debugger for free.

```
 component ──dispatch(action)──▶ reducer (pure) ──▶ new state ──selector──▶ component (selectSignal)
                         └──────▶ effects (02): side effects, HTTP ──▶ more actions
```
```ts
export const alertsFeature = createFeature({
  name: 'alerts',
  reducer: createReducer(initialState,
    on(AlertsPageActions.filterChanged, (s, { filter }) => ({ ...s, filter })),
  ),
  extraSelectors: ({ selectAlerts, selectFilter }) => ({
    selectVisible: createSelector(selectAlerts, selectFilter, (alerts, f) => …),
  }),
});
// component
visible = inject(Store).selectSignal(alertsFeature.selectVisible);
store.dispatch(AlertsPageActions.filterChanged({ filter: 'NEW' }));
```
Wiring: `provideStore()` once at the root (`app.config.ts`, with `provideStoreDevtools()` in dev), then each lazy feature adds `provideState(alertsFeature)` + `provideEffects(...)` on its routes (`module.ts`). Putting `provideStore()` on a route breaks effects: their runner lives in the root injector.

## Your tasks: `alerts.feature.ts` TODO 1–2
Actions (`alerts.actions.ts`) and the table (`triage-view.ts`) are done. Read the actions first: they're the feature's vocabulary.

## Senior notes
- **Actions are events, not setters.** `[Alerts Page] Triage Clicked`, not `setAlertStatus`. Several reducers and effects can react to one event, and the DevTools log reads like a story.
- Reducers must be **pure**: no HTTP, no `Date.now()`, no random, no mutation (the test checks untouched rows keep their identity).
- Selectors are **memoized**: same input, same output reference, so OnPush views don't re-render for nothing.
- When **not** to use NgRx: a single-screen feature with local state. A signal store (03, or Day 3 of angular-3day) is less ceremony. Teams adopt NgRx for large shared state, audit/debuggability, and consistency across many developers.
- **Gen 1:** `StoreModule.forRoot/forFeature`, `createAction` + `switch` reducers, `store.select(...) | async`. **Gen 2:** `createFeature`, `createActionGroup`, standalone `provideStore`. **Gen 3:** `store.selectSignal()`, and NgRx SignalStore (03) for local/feature state.
