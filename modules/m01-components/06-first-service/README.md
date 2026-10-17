# M01.06 · A first shared service  ⏱ 40 min

The **analyst watchlist**: indicators you want to keep an eye on. Two components that know nothing about each other, a picker and a panel, must share **one** list.

## The bug you start with
The starter components each do `new WatchlistService()`. Run the app: adding in the picker doesn't show up in the panel, because there are **two separate lists**. Dependency injection fixes that by giving both components the *same* instance.

## Concepts
```ts
@Injectable({ providedIn: 'root' })        // one shared instance for the whole app (a "singleton")
export class WatchlistService {
  private readonly ids = signal<number[]>([]);          // private + writable: only the service changes it
  readonly watched = this.ids.asReadonly();             // public + read-only: components can only read
  readonly count = computed(() => this.ids().length);
  add(id: number) { this.ids.update(ids => [...ids, id]); }
}

export class WatchlistPanel {
  protected readonly watchlist = inject(WatchlistService);   // Gen 3: inject()
}
```
**Generations**
- **Gen 1 · v2–v13:** constructor injection, `constructor(private watchlist: WatchlistService) {}`, and state in a `BehaviorSubject` (`private ids$ = new BehaviorSubject<number[]>([])`) consumed with `| async`. You'll meet this pattern constantly.
- **Gen 2 · v14–v16:** `inject()` arrives in v14. Signals in services arrive in v16.
- **Gen 3 · v22:** `inject()` plus private writable signal / public `asReadonly()` / `computed`. That's what you write here. M08 covers DI in depth (injector tree, providers, tokens).

## Your tasks
- `watchlist.service.ts`: TODO 1–5
- `indicator-picker.ts` and `watchlist-panel.ts`: TODO 6. Replace `new` with `inject()`.

## Check
`npm run ex -- m01/06`. In the app, add a few indicators and **reload**: the watchlist survives (localStorage).

## Senior notes
- Expose read-only state and named methods (`add`, `remove`), never the writable signal. Then every change to the state goes through code you can find, log and test.
- `effect()` is the right tool for syncing to the *outside world* (localStorage, `document.title`, analytics), not for deriving state (use `computed`).
- localStorage is readable by any script on your origin. It's fine for preferences, but **never** store tokens or secrets there (M15/M26).
