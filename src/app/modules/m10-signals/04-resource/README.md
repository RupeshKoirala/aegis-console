# M10.04 · `resource` & `httpResource`  ⏱ 45 min

**Verdict lookup.** Type an IP or domain and get the live verdict from `GET /api/v1/verdict?q=…`, with loading, error and empty states, and **no subscriptions in sight**.

```ts
readonly verdict = httpResource<VerdictView>(() => {
  const q = this.query().trim();
  return q ? { url: '/api/v1/verdict', params: { q } } : undefined;   // undefined = "don't load"
});
// template
@if (verdict.isLoading()) { … } @else if (verdict.error()) { … } @else if (verdict.hasValue()) { verdict.value() }
<button (click)="verdict.reload()">Retry</button>
```
A new query **cancels** the in-flight request automatically, like `switchMap`. And `resource({ params, loader })` does the same for any Promise-based async source:
```ts
readonly score = resource({ params: () => this.query(), loader: ({ params, abortSignal }) => scoreLocally(params, abortSignal) });
```

## Your tasks: `page.ts` TODO 1–2, `page.html` TODO 3
Try it live: `npm start`, open `/m10/04`, and type `203.0.113.66`, then `notvalid`, then add `&_delay=1500` to watch the loading state (TODO 2 shows you how).

## Senior notes
- `httpResource` is built on `HttpClient`, so your interceptors and `HttpTestingController` still apply.
- It's for **reads**. Mutations (POST/DELETE) stay as explicit `HttpClient` calls (M12), and a resource can `reload()` afterwards.
- `value()` **throws** when the resource is in an error state. Guard with `hasValue()`, or check `error()` first.
