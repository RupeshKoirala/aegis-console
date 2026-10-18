# M23.01 · Writing SSR-safe code  ⏱ 40 min

The console is behind a login, so it stays a SPA. But Aegis also publishes **public threat reports** (`/reports/2026-10-botnet-wave`), and those should be **server-rendered** (SSR) or **prerendered at build time** (SSG):
- search engines and Slack/Teams link previews get real HTML and `<meta>` tags,
- first paint is faster (HTML arrives ready, then Angular **hydrates** it instead of re-rendering).

The catch: on the server there's **no browser**. `window`, `localStorage`, `matchMedia`, `getBoundingClientRect`, `setInterval` that never stops… all crash the render or keep it from finishing.

```ts
private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
if (this.isBrowser) { localStorage.getItem(…) }           // guard browser-only APIs

afterNextRender(() => measure(this.el.nativeElement));      // never runs on the server: DOM work goes here

inject(Title).setTitle(…); inject(Meta).updateTag(…);       // SSR-safe abstractions over document.head
```

## Your tasks: `report-header.ts` TODO 1–3
Tests render the component once as `'server'` and once as `'browser'` (`{ provide: PLATFORM_ID, useValue: … }`).

## Senior notes
- **Hydration mismatches:** if the server renders "comfortable" and the browser immediately renders "compact", the user sees a flash. For user preferences, use a cookie (readable on the server via `REQUEST`) or accept the flash for non-critical UI.
- Server rendering waits until the app is **stable**: pending HTTP, timers and `PendingTasks`. A `setInterval` started on the server means the response never finishes. Start polling in `afterNextRender`.
- `DOCUMENT` (injected) works on the server (a DOM emulation), but layout values are meaningless there.
- **Gen 1:** Angular Universal (`@nguniversal/express-engine`), full re-render on the client (flicker). **Gen 2 (v16–v17):** `@angular/ssr`, non-destructive hydration, `afterRender`. **Gen 3 (v19–v22):** per-route render modes (02), incremental hydration (`@defer (hydrate on viewport)`), event replay.
