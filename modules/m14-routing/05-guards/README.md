# M14.05 · Guards  ⏱ 50 min

Three questions the router asks before it changes the screen:

| Guard | Question | Typical use in Aegis |
|---|---|---|
| `canMatch` | Does this route even **exist** for this user? `false` → try the next route | feature flags, role-specific variants of a page, A/B |
| `canActivate` / `canActivateChild` | May they **enter**? `UrlTree` → redirect | role checks → `/forbidden`, not signed in → `/login` (M15) |
| `canDeactivate` | May they **leave**? | unsaved form changes |

Functional guards are plain functions that can `inject()`. Factories make them reusable:
```ts
export function requireRole(...roles: Role[]): CanActivateFn {
  return (route, state) => roles.includes(inject(Session).role()) || inject(Router).parseUrl('/forbidden');
}
{ path: 'admin/users', component: Users, canActivate: [requireRole('ADMIN')] }
```

## Your tasks
- `guards.ts` TODO 1–3
- `routes.ts` TODO 4

## Senior notes
- **Guards are UX, not security.** Anyone can edit the JS or call the API directly. The API enforces roles again (`403 Requires role ADMIN`, which you saw in M12). A guard only spares honest users a broken page.
- `canMatch` is also what prevents a **lazy chunk** from even downloading for users who can't use it (M14.06). `canActivate` runs after the chunk loads.
- Redirect, don't return `false`. A bare `false` leaves the user on the old page with no explanation.
- **Gen 1:** `@Injectable() class AdminGuard implements CanActivate`, and `canLoad` (deprecated, replaced by `canMatch`). **Gen 2 (v14.2+):** functional guards. Class guards still work through `mapToCanActivate([AdminGuard])` during migrations.
