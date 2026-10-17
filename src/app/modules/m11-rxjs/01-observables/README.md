# M11.01 · Observables from scratch  ⏱ 40 min

An Observable is just a **function that, when subscribed to, starts producing values** and returns a **teardown**:
```ts
const heartbeat = (ms: number) => new Observable<number>(subscriber => {
  let n = 0;
  const id = setInterval(() => subscriber.next(++n), ms);   // produce
  return () => clearInterval(id);                           // teardown on unsubscribe / complete / error
});
```
- **Cold:** every subscriber gets its *own* execution (two subscribers = two intervals). HTTP calls are cold.
- **Hot:** subscribers share one execution (`share()`, Subjects, DOM events).
- The contract: `next*` then optionally **one** `error` *or* `complete`, after which nothing else is delivered.

You'll build a **heartbeat** (is the appliance alive?) and a **feed parser** that turns a raw threat-feed text file into a stream of indicators, failing loudly on garbage.

## Your tasks: `streams.ts` TODO 1–2

## Senior notes
- Every `subscribe()` you write is a resource you must release: unsubscribe, `takeUntilDestroyed`, or let the `async` pipe / `toSignal` do it.
- Prefer existing creation functions (`interval`, `timer`, `from`, `fromEvent`) in production. Writing one by hand once is how you learn what teardown really means.
