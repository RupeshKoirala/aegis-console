# M10 · Signals in depth

📖 **Read first (Study Hub):** `angular-manual/m6` signals, the reactive graph · `m7` async signals, linkedSignal and resource · `angular/l10`

You've used `signal`/`computed`/`effect` since M01. Now for how they actually work: a **dependency graph** that is **lazily** recomputed, **glitch-free**, and **equality-gated**. Plus the newer primitives for state that depends on other state (`linkedSignal`) and for async data (`resource`, `httpResource`).

| # | Exercise | You practise |
|---|---|---|
| 01 | The reactive graph & equality | dependency tracking, laziness, `equal` functions, avoiding useless recomputation |
| 02 | `linkedSignal` | writable state that **resets** when its source changes (selection, pagination) |
| 03 | `untracked` & effect cleanup | reading without subscribing, `onCleanup` for timers and requests |
| 04 | `resource` & `httpResource` | async data as signals: `value()`, `isLoading()`, `error()`, `reload()` |

### Generations
- **Gen 1:** `BehaviorSubject` + `combineLatest` + `distinctUntilChanged` + `async` pipe for all of this.
- **Gen 2 (v16–v19):** `signal`/`computed`/`effect` arrive. `linkedSignal`/`resource` are experimental (v19).
- **Gen 3 (v20–v22):** all stable. `httpResource` is the idiomatic way to load data that depends on signals.
