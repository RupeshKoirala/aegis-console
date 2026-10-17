# M12.04 · Interceptors  ⏱ 50 min

An interceptor wraps **every** request and response, so it's the place for cross-cutting concerns. You'll write the four the console needs:

| Interceptor | Job |
|---|---|
| `correlationIdInterceptor` | add `X-Correlation-Id: <uuid>` (unless present) so one click can be traced through frontend logs, API gateway and backend logs (series 5!) |
| `tenantInterceptor` | MSP admins act for a child tenant: add `X-Tenant-Id` when `TenantContext.actingFor()` is set, **only** for `/api/` URLs |
| `sessionInterceptor` | on a `401` response, flag `SessionEvents.expired` (M15 turns this into a redirect to login) and rethrow |
| `TimingInterceptor` (Gen 1 class) | log `GET /api/v1/lists → 200 in 12 ms` |

```ts
export const correlationIdInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Correlation-Id': crypto.randomUUID() } }));   // requests are IMMUTABLE: clone
```
Registered in `module.ts` (read it!): `provideHttpClient(withInterceptors([...]), withInterceptorsFromDi())` plus the class via `HTTP_INTERCEPTORS`. **Order:** requests flow through the list top to bottom, and responses come back bottom to top.

## Your tasks: `interceptors.ts` TODO 1–4

## Senior notes
- 🔐 Never attach tokens or tenant headers to **third-party** URLs. Always check the URL or origin first. Leaking a bearer token to an analytics CDN is a real incident pattern.
- Interceptors run for `httpResource` too, because it uses `HttpClient` under the hood.
- Retrying, caching and loading spinners are also interceptor material (next exercise). Business logic isn't.
