# M12.02 · Loading, errors, problem+json  ⏱ 45 min

Every Aegis API error is **RFC 9457 problem details** (`application/problem+json`):
```json
{ "title": "Bad Request", "status": 400, "detail": "Validation failed", "instance": "/api/v1/lists/3/indicators",
  "errors": { "category": "is required on threat lists", "score": "must be between 1 and 100" } }
```
`HttpClient` delivers failures as an `HttpErrorResponse`:
- `err.status === 0` → the request never got an HTTP answer (offline, CORS, server down)
- `err.error` → the parsed body, which is our problem object

## Your tasks
- `problem.ts` TODO 1: `toProblem(err)` normalises **any** error into a `Problem`.
- `list-store.ts` TODO 2–3: a small signal store with `loading` / `error` / `items` states.
- `page.html` TODO 4: render the three states. Use the fake API's switches to see them live: the page has buttons that add `?_fail=500` or `?_delay=1500`.

## Senior notes
- Every async UI has **at least** four states: idle, loading, success (possibly empty), error. Design all four, every time.
- Never show raw server errors or stack traces to users. Show `detail` (written for humans) and log the rest with the correlation id (M12.04).
- A *stale-while-revalidate* UI (keep showing old data while reloading) feels much faster than blanking the table.
