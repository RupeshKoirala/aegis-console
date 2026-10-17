# M08.01 · The injector tree  ⏱ 35 min

Three kinds of **block counters** (a tiny stateful service) show where the instance lives:

| Widget | Where `CounterService` is provided | Result |
|---|---|---|
| `aegis-shared-counter` ×2 | the **page's** `providers` | both read and write **one** instance |
| `aegis-isolated-counter` ×2 | each **component's own** `providers` | each gets its **own** instance |
| `RootCounter` | `@Injectable({ providedIn: 'root' })` | one instance for the **whole app**, kept across routes |

```ts
@Component({ providers: [CounterService] })      // a NEW instance for this component and its children
@Component({ viewProviders: [CounterService] })  // same, but visible only to its own view, not projected content
```

## Your tasks: `isolated-counter.ts` TODO 1, `page.ts` TODO 2
`counter.service.ts` deliberately has **no** `providedIn`, so if nobody provides it you get `NG0201 No provider for CounterService`. Read that error once, because you'll see it at work.

## Senior notes
- Component-level providers are perfect for **per-widget state** (a form wizard's state, a table's selection). Each instance is created and destroyed with its component, and the service's `ngOnDestroy` runs.
- Lazy routes get their **own environment injector**. A service listed in a lazy route's `providers` is a separate instance from the root one. That's useful for feature isolation and a classic "why did my state reset" bug.
- Angular DevTools → *Injector tree* shows exactly this hierarchy at runtime.
