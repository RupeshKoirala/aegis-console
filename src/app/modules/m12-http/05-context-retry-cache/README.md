# M12.05 · `HttpContext`, retry & cache  ⏱ 45 min

Two more interceptors, controlled **per request** with `HttpContext`:
```ts
export const CACHE_TTL = new HttpContextToken<number>(() => 0);       // default: don't cache
this.http.get('/api/v1/lists', { context: new HttpContext().set(CACHE_TTL, 30_000) });
```
- `cachingInterceptor`: for **GET** requests with `CACHE_TTL > 0`, serve a fresh cached `HttpResponse` if one exists (keyed by `urlWithParams`), otherwise call through and store the response.
- `retryInterceptor`: retry **GET** only, up to **2** more times, only for **status 0 or ≥ 500**, waiting `300 ms × attempt`. Never retry 4xx (the request itself is wrong) or POST/DELETE (not idempotent).

## Your tasks: `interceptors.ts` TODO 1–2

## Senior notes
- Cache invalidation is the hard part. After a mutation, clear the affected keys (or the whole cache) and `reload()`.
- Retrying a request that failed because **you're being rate-limited** (429) makes it worse. Respect `Retry-After`.
- `HttpContext` is also how you'd opt specific calls out of the auth interceptor (e.g. the login call itself).
