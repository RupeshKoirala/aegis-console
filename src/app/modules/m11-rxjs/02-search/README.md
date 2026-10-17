# M11.02 · Search-as-you-type  ⏱ 40 min

The indicator search box sends a request per keystroke and shows results out of order. That's five bugs in one. Build the classic pipeline:
```ts
query$.pipe(
  debounceTime(300),                 // wait until typing pauses
  map(q => q.trim().toLowerCase()),
  distinctUntilChanged(),            // "evil" → "evil " → no new request
  switchMap(q => q.length < 2        // switchMap CANCELS the previous request: no stale results
    ? of([])
    : api(q).pipe(catchError(() => of([])))),   // an error must not kill the whole stream
)
```
**Why `catchError` goes inside `switchMap`:** an error that reaches the outer stream *completes* it, and the search box would be dead until reload.

## Your tasks: `search.ts` TODO 1. `page.ts` is done (it connects a signal with `toObservable` / `toSignal`; read it).

## Senior notes
- Debounce on the client **and** rate-limit on the server. Never trust the client.
- `switchMap` is right for **reads**. For writes (saves) you usually want `concatMap` or `exhaustMap` (M11.03).
