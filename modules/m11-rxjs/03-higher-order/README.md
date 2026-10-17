# M11.03 · switch / concat / merge / exhaust  ⏱ 45 min

Clicks arrive at `t = 0, 50, 120 ms`. Each click starts `work(id)`, which answers after **100 ms**. What gets through?

| Operator | Policy | Aegis use | Output |
|---|---|---|---|
| `switchMap` | cancel the previous inner | search, "load details of the selected row" | only `#3 done` |
| `concatMap` | queue, one at a time, in order | saving list edits (order matters!) | `#1`, `#2`, `#3` at 100 / 200 / 300 ms |
| `mergeMap` | all in parallel | enrich 20 indicators at once | `#1`, `#2`, `#3` at 100 / 150 / 220 ms |
| `exhaustMap` | ignore new ones while busy | the "Refresh" or "Login" button (no double submit) | `#1`, `#3` |

Plus `retry({ count: 2, delay: 100 })` for a flaky enrichment call.

## Your tasks: `operators.ts` TODO 1–5. Each is one line, but you must predict the test output **before** running it.

## Senior notes
- Picking the wrong operator is a *correctness* bug, not a style choice. `switchMap` on a save **cancels writes**. `mergeMap` on a save can **reorder** them.
- `mergeMap(fn, 4)` takes a concurrency limit. Use it for bulk operations so you don't DOS your own API.
- Only retry **idempotent** requests (GET), and only on transient errors (503, network). Never retry a POST blindly.
