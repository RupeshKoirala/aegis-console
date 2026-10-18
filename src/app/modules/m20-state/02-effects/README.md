# M20.02 · Effects  ⏱ 50 min

Reducers are pure, so where does the HTTP go? Into **effects**: they listen to the action stream, do the side effect, and dispatch the result as new actions.

```ts
export const loadAlerts = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(AlertsPageActions.opened),
      switchMap(() => http.get<Alert[]>('/api/v1/alerts').pipe(
        map(alerts => AlertsApiActions.loadSucceeded({ alerts })),
        catchError(e => of(AlertsApiActions.loadFailed({ error: … }))),   // INSIDE, or the effect dies
      )),
    ),
  { functional: true },
);
provideEffects({ loadAlerts, triageAlert })
```
The **flattening operator is a product decision** (you met these in M11.03):
| Effect | Operator | Why |
|---|---|---|
| load the list | `switchMap` | only the latest request matters |
| triage different alerts | `mergeMap` | independent: never cancel each other |
| save a form in order | `concatMap` | order matters |
| "Run feed import" button | `exhaustMap` | ignore clicks while one is running |

## Your tasks: `alerts.effects.ts` TODO 1–2
Then `/m20/02` runs against the real fake API. Triage some alerts, then reload: the server kept them.

## Senior notes
- Optimistic UI here is a **collaboration**: the reducer applies the change on `Triage Clicked`, the effect confirms or reports failure, and the reducer rolls back on `Triage Failed`. The `previous` status travels in the action so the rollback needs no extra lookup.
- Test effects in isolation with `provideMockActions` + `HttpTestingController`, and test the loop once with the real store (the second `describe`).
- Effects that don't dispatch (logging, navigation) use `{ dispatch: false }`.
- **Gen 1:** `@Effect()` decorators on class properties. **Gen 2:** `createEffect` in `@Injectable` classes. **Gen 3:** functional effects with `inject()` default parameters (as here).
