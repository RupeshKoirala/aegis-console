# M12.01 · Typed GET with params  ⏱ 40 min

**The lists screen:** a list picker on the left, a paged indicator table on the right with search.
```ts
private readonly http = inject(HttpClient);

lists() { return this.http.get<ListView[]>('/api/v1/lists'); }

indicators(listId: number, opts: { q?: string; page?: number; size?: number }) {
  let params = new HttpParams().set('page', opts.page ?? 0).set('size', opts.size ?? 10);
  if (opts.q?.trim()) params = params.set('q', opts.q.trim());          // don't send empty filters
  return this.http.get<Page<IndicatorView>>(`/api/v1/lists/${listId}/indicators`, { params });
}
```
`get<T>` only **asserts** the type. It doesn't validate anything at runtime, so treat the API boundary with suspicion (Senior notes).

## Your tasks: `lists-api.ts` TODO 1–2, `page.ts` TODO 3–4

## Senior notes
- Keep components free of URLs. A thin API service per resource is the seam where you mock, version, and later swap the fake API for Spring Boot.
- Typed ≠ validated. For security-relevant fields, validate the shape (`zod`, or hand-written guards) before trusting it.
- `HttpParams` is **immutable**. `params.set(...)` returns a new instance, which is the classic "my params are empty" bug.
