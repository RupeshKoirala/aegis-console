# M15 · Auth

📖 **Read first (Study Hub):** `foundations/l26` authentication & authorization in apps · `foundations/l19` browser security & state · `cyber/l12` identity & access

Until now a training interceptor signed every request as `admin@acme.test`. In this module the M15 routes get their **own** `HttpClient` (route-level `provideHttpClient` in `module.ts`) wired to **your** interceptors, and you sign in for real against the fake API: JWT access tokens (15 min), rotating refresh tokens, roles, and MSP tenants.

Seed users (password `password123`): `admin@acme.test` (ADMIN), `analyst@acme.test` (ANALYST), `viewer@acme.test` (READ_ONLY), `admin@globex.test`, and `msp@shieldline.test` (MSP ADMIN of Acme + Globex).

| # | Exercise | You practise |
|---|---|---|
| 01 | Login & token storage | `AuthService`, problem errors, persistence with an `effect`, storage trade-offs |
| 02 | Auth interceptor & refresh | bearer header, 401 → single-flight refresh → retry once, rotation |
| 03 | Guards & permissions | `authGuard` + `returnUrl`, `canActivateChild`, a permission matrix, `*aegisCan` |
| 04 | MSP tenant switch & idle timeout | `X-Tenant-Id`, `linkedSignal` reset on user change, inactivity sign-out |

### Generations
- **Gen 1:** `AuthService` with `BehaviorSubject<User>`, class `HttpInterceptor` + `refreshing$` subject, class guards, `localStorage` reads everywhere.
- **Gen 2 (v15+):** functional interceptors and guards, `inject()`.
- **Gen 3 (v20–v22):** session as **signals**, `httpResource` that re-fetches when the tenant changes, `linkedSignal` for state that must reset, `effect` for persistence and redirects.

OIDC (Authorization Code + PKCE with Keycloak) is the production answer. It's covered conceptually in the READMEs and implemented for real in the backend series, where the identity provider lives.
