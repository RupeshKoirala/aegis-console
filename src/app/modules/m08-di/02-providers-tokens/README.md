# M08.02 · Providers & InjectionTokens  ⏱ 45 min

Real apps inject **configuration**, **feature flags** and **swappable implementations**, not just services.

```ts
export const AEGIS_CONFIG = new InjectionToken<AegisConfig>('aegis.config');   // a key for a non-class value

providers: [
  { provide: AEGIS_CONFIG, useValue: { apiBase: '/api/v1', threshold: 90, env: 'staging' } },
  { provide: FEATURE_FLAGS, useFactory: () => flagsFor(inject(AEGIS_CONFIG).env) },   // computed from other deps
  { provide: Logger, useClass: ConsoleLogger },                                        // swap implementation
  { provide: AUDIT_LOGGER, useExisting: Logger },                                      // alias: SAME instance
]
```
`Logger` is an **abstract class** used as a token: consumers depend on the abstraction, and the provider picks the implementation. That's the Dependency Inversion principle, the same thing Spring does with interfaces + `@Bean`.

## Your tasks: `page.ts` TODO 1–4 (the providers array). `tokens.ts` is done, so read it first.

## Senior notes
- Tokens can ship their own default: `new InjectionToken('x', { providedIn: 'root', factory: () => … })`. Then nobody has to provide it, but anyone can override it.
- `useValue` objects are shared by reference. Freeze configs (`Object.freeze`) so no consumer can mutate them for everyone.
- Tests swap implementations the same way: `TestBed.configureTestingModule({ providers: [{ provide: Logger, useClass: FakeLogger }] })`.
