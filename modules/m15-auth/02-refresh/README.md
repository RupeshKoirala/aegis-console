# M15.02 · Auth interceptor & the 401 → refresh flow  ⏱ 70 min

Access tokens live for 15 minutes on purpose: a stolen one is useless soon. But analysts work all day, so when a call returns **401** you silently exchange the **refresh token** for a new pair, then **retry** the call. The user never notices.

```
GET /me  ──401──▶  POST /auth/refresh { refreshToken }  ──200 { token, refreshToken }──▶  GET /me (new token) ──200
```
Two things make this hard and worth an exercise:
1. **Single-flight.** The dashboard fires 5 requests at once, and all 5 get 401. The refresh token is **single use (rotation)**, so 5 refreshes means 4 failures and a forced sign-out. All 5 must wait on **one** refresh (`shareReplay(1)` in a field, reset in `finalize`).
2. **No loops.** Retry exactly once. A 401 on the retry, a 403, or a failed refresh is final.

## Your tasks: `auth.interceptor.ts` TODO 1–3
Then run `npm start`, open `/m15/02`, sign in, click "Break my access token", then "3 requests at once", and watch the Network tab. (`AEGIS_TOKEN_TTL=20 npm run api` makes real expiry happen every 20 s.)

## Senior notes
- **Proactive refresh:** you know `expiresAt`, so schedule a refresh ~60 s before it. That avoids the 401 round-trip entirely. Keep the reactive path anyway (laptop sleep, clock skew).
- **Rotation + reuse detection** is why concurrency matters: a well-built server revokes the *whole family* when an old refresh token is reused, because that pattern means it was stolen.
- Interceptor order matters. Put auth **before** retry/cache, so retries carry the fresh token.
- With an identity provider (Keycloak etc.), a library such as `angular-auth-oidc-client` does this for you. Knowing *what* it does is what you're paid for when it breaks.
- Gen 1: a class `HttpInterceptor` with a `BehaviorSubject<boolean> refreshing$` and `filter(r => !r), take(1)` to queue requests. The same idea, with far more code.
