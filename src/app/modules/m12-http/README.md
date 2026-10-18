# M12 · HTTP & interceptors

📖 **Read first (Study Hub):** `foundations/l16` HTTP & API design · `js/l11` fetch & JSON · `angular-manual/m14` HTTP & interceptors · `capstone/l1` the API (this exact contract)

From here on the console talks to the **fake API** (`npm start` runs it). Its contract is in `api/openapi.yaml`, and it's the same contract the Spring Boot series will implement. Until M15 every request is signed in as `admin@acme.test` by a training interceptor (`src/app/core/training-auth.interceptor.ts`).

| # | Exercise | You practise |
|---|---|---|
| 01 | Typed GET with params | `HttpClient.get<T>`, `HttpParams`, typed DTOs, a thin API service |
| 02 | Loading, errors, problem+json | loading/error state, `HttpErrorResponse`, RFC 9457 problem details, field errors |
| 03 | POST, DELETE & optimistic updates | creating with `201 + Location`, 409 conflicts, optimistic delete with rollback |
| 04 | Interceptors | functional interceptors (correlation id, tenant header, session expiry), a Gen 1 class interceptor, ordering |
| 05 | HttpContext, retry & cache | per-request options, retrying only safe requests, a TTL cache |
| 06 | Testing HTTP code | `HttpTestingController`: you write the tests this time |
| 07 | Trace the onion | log every interceptor step with timestamps and see the out/back order, plus an interactive explainer |

### Generations
- **Gen 1:** `HttpClientModule`, class interceptors via `HTTP_INTERCEPTORS`, `subscribe()` everywhere, `| async`.
- **Gen 2 (v15+):** `provideHttpClient(withInterceptors([fn]))` and functional interceptors.
- **Gen 3:** the same, plus `httpResource` for reads (M10.04) and signals for UI state.
