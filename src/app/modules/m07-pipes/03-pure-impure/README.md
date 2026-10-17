# M07.03 · Pure vs impure pipes  ⏱ 35 min

A sorted watchlist. You add an indicator… and the sorted view doesn't change. That's the most-asked pipe question on Stack Overflow.

## Why
A **pure** pipe (the default) re-runs only when its input **reference** changes (`===`). `list.push(x)` mutates the same array, so the reference is unchanged, the pipe isn't called again, and the screen is stale.

Two fixes:
1. ✅ **Immutable updates:** `list = [...list, x]` (or `signal.update(l => [...l, x])`). The reference changes, the pure pipe re-runs, and it costs nothing extra.
2. ⚠️ `@Pipe({ name: 'sortBy', pure: false })`: the pipe now runs on **every** change detection pass, for every row, even when nothing changed. That's the "it works but the dashboard is slow" fix.

`call-counter.ts` counts pipe invocations so you can *see* the difference.

## Your tasks: `page.ts` TODO 1–2, `impure-sort.pipe.ts` TODO 3

## Senior notes
- The `async` pipe is impure (it has to check for new emissions), and that's fine because it's cheap. Your sort-10k-rows pipe isn't.
- For derived lists in v22, prefer a `computed()` over a pipe. It's memoised like a pure pipe and also usable in TypeScript.
