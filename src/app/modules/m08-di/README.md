# M08 · Dependency injection in depth

📖 **Read first (Study Hub):** `angular-manual/m11` dependency injection · `foundations/l12` design principles · `spring/l2` (Spring's DI: the same idea on the backend you'll build later)

DI answers two questions: **who creates this object** and **which instance do I get**. Angular looks up a chain of injectors: the element injectors (component → parent component → … → root component), then the environment injectors (route → root → platform). The **first** injector that has a provider wins.

| # | Exercise | You practise |
|---|---|---|
| 01 | The injector tree | `providedIn: 'root'` vs component `providers` vs `viewProviders`: shared or isolated instances |
| 02 | Providers & tokens | `InjectionToken`, `useValue`, `useFactory`, `useClass`, `useExisting`, abstract-class tokens |
| 03 | Resolution modifiers | `{ optional, self, skipSelf, host }` and their Gen 1 decorators `@Optional() @Self() @SkipSelf() @Host()` |
| 04 | Multi providers & injection context | `multi: true` plugin lists, `runInInjectionContext`, `EnvironmentInjector` |

### Generations
- **Gen 1:** `constructor(@Inject(APP_CONFIG) private config: AegisConfig, @Optional() @SkipSelf() parent?: TreeNode)`, with providers declared in NgModules.
- **Gen 2 (v14+):** `inject()` works in constructors and field initialisers. Functional guards and interceptors depend on it.
- **Gen 3:** `inject()` everywhere, `provideX()` functions in `app.config.ts`, and environment providers.
