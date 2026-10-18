# M23 · SSR, SSG & hydration

📖 **Read first (Study Hub):** `angular-manual/m16` rendering: SSR, hydration, performance · `foundations/l15` what happens when you type a URL · `foundations/l30` CI/CD & deployment

| # | Exercise | You practise |
|---|---|---|
| 01 | SSR-safe code | `isPlatformBrowser`, `afterNextRender`, `Title`/`Meta` for SEO, testing as server and as browser |
| 02 | Render modes per route | `RenderMode.Prerender/Server/Client`, `getPrerenderParams`, `PrerenderFallback`, plus a lab building a real SSR site |

### Generations
- **Gen 1:** Angular Universal, destructive hydration (the client re-rendered everything).
- **Gen 2 (v16–v18):** `@angular/ssr`, non-destructive hydration, event replay.
- **Gen 3 (v19–v22):** route-level render modes, incremental hydration with `@defer (hydrate on …)`.
