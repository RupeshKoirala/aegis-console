# M15.03 · Guards & permissions  ⏱ 60 min

Now the guards from M14.05 use the **real session**:
- `authGuard`: signed out → `/login?returnUrl=…`. After login → back where they were going.
- `requirePermission('user:manage')`: wrong role → `/forbidden`.
- `canActivateChild` re-checks on **every** navigation inside `/console`, not just on entry.

And a structural directive for the **template** side: hide or replace buttons the role can't use.
```html
<button *aegisCan="'indicator:write'; else readOnly">+ indicator</button>
<ng-template #readOnly><span class="badge">read only</span></ng-template>
```
Permissions, not roles, in templates: `*aegisCan="'list:delete'"` survives the day product adds a `SOC_LEAD` role. `*hasRole="'ADMIN'"` sprinkled everywhere doesn't.

## Your tasks
- `permissions.ts` TODO 1 + 3
- `guards.ts` TODO 2a–b
- `routes.ts` TODO 2c–d
- `pages.ts` TODO 4

## Senior notes
- Again: **hiding a button is not authorization.** The API returns 403 for a READ_ONLY user who crafts the request by hand (try it with curl and a viewer token). The UI just avoids offering dead ends.
- `returnUrl` is an **open-redirect** risk if you ever navigate to an absolute URL from it. `navigateByUrl` with an app-relative path is safe. Never `window.location = returnUrl`.
- Where does the permission table come from? Here it's hard-coded and mirrors the API. Mature systems serve it (`GET /me` → `permissions: [...]`) so the UI and API can't drift apart.
- Gen 2's `*hasRole` (M06.03) used `@Input set hasRole(...)` plus a subscription to the user stream. Gen 3 uses `input()` + `effect()`, with no subscription bookkeeping.
