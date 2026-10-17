# M15.01 · Login & token storage  ⏱ 60 min

The training interceptor is gone for this module. From now on you **sign in**.

`POST /api/v1/auth/login { email, password }` returns:
```json
{ "token": "<JWT, 15 min>", "refreshToken": "<opaque, single use>", "expiresIn": 900, "user": { "role": "ANALYST", "tenantId": 1, … } }
```
`Session` (`../shared/session.ts`, done for you) holds that state as signals. You build the `AuthService` around it: `login()`, `logout()` and **persistence across reloads**.

## Your tasks: `auth.service.ts` TODO 1–3
Then open `/m15/01`, sign in, reload, and sign out. With DevTools → Application → Session storage open, watch the key appear and disappear.

## Where should tokens live? (a classic interview question)
| Option | XSS can steal it? | Survives reload? | Notes |
|---|---|---|---|
| Memory (a signal) | only while the page runs | ✗ | safest SPA option, but every reload means signing in again (or a silent refresh) |
| `sessionStorage` | ✓ | ✓ (this tab) | what we do here: a reasonable training default |
| `localStorage` | ✓ | ✓ (all tabs, forever) | the most common, and the most criticized |
| **HttpOnly cookie** set by the server | ✗ | ✓ | needs CSRF protection (SameSite + token). The **BFF** pattern keeps tokens server-side entirely |

The real answer at a security company: **don't let XSS happen** (M26), keep the access token short-lived, put the **refresh token in an HttpOnly cookie** or behind a BFF, and use **OIDC Authorization Code + PKCE** with an identity provider (Keycloak, Okta, Entra). The backend series implements that side.

## Senior notes
- A JWT is **signed, not encrypted**: anyone can read the claims (paste one into a decoder). Never put secrets in it, and never trust client-side decoded roles for anything but UI.
- Always clear local state on logout even if the server call fails. A user who clicked "sign out" must not stay signed in because of a network blip.
- `autocomplete="username"` / `"current-password"` let password managers work, which is a security feature.
- Gen 1 code you'll see: an `AuthService` with `BehaviorSubject<User | null>`, `currentUser$ | async` everywhere, and `localStorage.getItem('token')` sprinkled in interceptors. Gen 3: one `Session` with signals and one place that touches storage.
