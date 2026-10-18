# M23.02 · Render modes per route  ⏱ 30 min + lab

One Angular app can mix rendering strategies **per route** (`app.routes.server.ts`):

| Mode | When HTML is made | Use for | Cost |
|---|---|---|---|
| `Prerender` (SSG) | at **build** | public, same-for-everyone pages | none at runtime (static files on a CDN) |
| `Server` (SSR) | on each **request** | fresh or personalised public pages | server CPU per request |
| `Client` (CSR) | in the **browser** | pages behind a login | none on the server, slower first paint |

## Your tasks: `app.routes.server.ts` TODO 1

## Lab: build the public reports site (45 min)
```bash
cd ..                                              # outside aegis-console
npx @angular/cli@22 new aegis-reports --ssr --style=css --zoneless
cd aegis-reports
```
1. Add routes `''`, `reports`, `reports/:slug` (a component that shows the report with `input()` and `ReportHeader`-style SEO tags from M23.01), `status`.
2. Paste your `serverRoutes` into `src/app/app.routes.server.ts`, and `reports.ts` next to it.
3. `npx ng build` → look in `dist/aegis-reports/browser/reports/2026-10-botnet-wave/index.html`: **real HTML**, with your `<title>` and `<meta>`, before any JS runs.
4. `node dist/aegis-reports/server/server.mjs` → open `/status` and *View source*: rendered per request.
5. In `app.config.ts`, note `provideClientHydration(withEventReplay())`. Add `withIncrementalHydration()` and wrap a heavy section in `@defer (hydrate on viewport) { … }`. It's server-rendered HTML that only becomes interactive when scrolled to.

## Senior notes
- **Never** SSR/prerender per-user data without care: a CDN caching `/console` HTML could serve one tenant's data to another. Client mode for authenticated areas is the safe default.
- SSR needs a **Node runtime** (container, Lambda, Cloud Run…), while SSG needs only static hosting (S3 + CloudFront: the AWS series).
- `HttpClient` requests made during SSR are **transferred** to the browser (HTTP transfer cache), so hydration doesn't refetch them.
- **Gen 1:** Universal + `renderModule`, prerender via separate scripts. **Gen 2 (v17):** `@angular/ssr`, `ng new --ssr`, the application builder's `prerender` option. **Gen 3 (v19–v22):** `ServerRoute[]` render modes, `getPrerenderParams`, incremental hydration.
