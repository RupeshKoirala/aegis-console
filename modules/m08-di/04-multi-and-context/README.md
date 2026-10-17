# M08.04 · Multi providers & the injection context  ⏱ 35 min

**Enrichment plugins.** When an analyst opens an indicator, several independent enrichers add context: geo, ASN, reputation. New enrichers must be pluggable **without editing** the service that runs them (Open/Closed principle). That's exactly what `multi: true` is for.

```ts
export const ENRICHERS = new InjectionToken<Enricher[]>('enrichers');
providers: [
  { provide: ENRICHERS, useValue: geoEnricher, multi: true },
  { provide: ENRICHERS, useValue: asnEnricher, multi: true },   // the token now resolves to an ARRAY
]
```
Angular uses this pattern itself: `HTTP_INTERCEPTORS`, `APP_INITIALIZER`, `NG_VALIDATORS`…

## The injection context
`inject()` only works while Angular is creating something (constructor, field initialiser, factory, guard/interceptor/resolver function). Calling it later, in a click handler or `setTimeout`, throws `NG0203`. When you really must:
```ts
private readonly injector = inject(Injector);   // capture during construction
later() { runInInjectionContext(this.injector, () => inject(Something)); }
```

## Your tasks: `page.ts` TODO 1, `enrichment.service.ts` TODO 2–3

## Senior notes
- Prefer `provideX()` helper functions that hide the multi-provider details from app code: `provideEnrichers(geo, asn)` returning `makeEnvironmentProviders([...])`.
- Order matters: multi providers resolve in registration order, which is why interceptor order is significant (M12).
