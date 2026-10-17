# M15.04 · MSP tenant switch & session timeout  ⏱ 60 min

**Tenant switch.** An MSP (managed security provider) admin signs in **once** and manages many customers. Aegis models this as child tenants: `msp@shieldline.test` (Shieldline MSP) may act for *Acme Schools* and *Globex Health* by sending `X-Tenant-Id`.
- `TenantContext.actingFor` holds the chosen child, and must **reset** when the signed-in user changes. Acting for a customer must never leak into the next login on a shared workstation (`linkedSignal`).
- `tenantInterceptor` adds the header. Because `httpResource` reads `actingFor()`, the page re-fetches automatically on switch.

**Idle timeout.** SOC consoles stay open on wall screens and shared desks. After N minutes of no input: warn, then sign out.

## Your tasks
- `tenant-context.ts` TODO 1–2
- `idle-timeout.ts` TODO 3–4

On `/m15/04`, sign in as `msp@shieldline.test`, switch tenants and watch the lists and the request headers change. The page uses a 15-minute timeout. Shorten it with a route provider for `IDLE_CONFIG` if you want to watch the banner.

## Senior notes
- **Never** let the client decide authorization: the server validates that `X-Tenant-Id` is your child (try a foreign id and you get 403). The header only *selects* among tenants you're already allowed to use. This is the multi-tenancy core of the backend series (row-level security).
- On tenant switch, **clear tenant-scoped caches** (M12.05's cache, NgRx state in M20). Stale data from tenant A shown under tenant B's name is a data leak.
- Idle detection across **tabs**: one tab's activity should keep the others alive. Use `BroadcastChannel` or `storage` events. And do sign-out *server-side* too (short refresh-token lifetime), because a sleeping laptop doesn't run your timers.
- Throttle activity events in real code (`mousemove` fires a lot). The method here is cheap, but a `fromEvent(...).pipe(throttleTime(1000))` version is the usual shape.
