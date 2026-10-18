import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
//@@sol
import { fetchPublishedReports } from './reports';
//@@end

/**
 * In an SSR app, this file (app.routes.server.ts) tells the server how to render EACH route:
 *   RenderMode.Prerender  → HTML generated once at BUILD time (SSG): fastest, cacheable on a CDN, for public pages
 *   RenderMode.Server     → HTML generated per REQUEST (SSR): fresh or personalised, but costs server CPU
 *   RenderMode.Client     → no server HTML, a classic SPA shell: for pages behind a login
 *
 * TODO 1: the Aegis public site + console:
 *   ''                 Prerender                     (the marketing/landing page)
 *   'reports'          Prerender                     (the list)
 *   'reports/:slug'    Prerender, with getPrerenderParams returning one { slug } per PUBLISHED report
 *                      (await fetchPublishedReports()), and fallback: PrerenderFallback.Server so a report published
 *                      after the build is still rendered on the server on first request
 *   'status'           Server                        (live service status: must be fresh on every request)
 *   'console/**'       Client                        (behind login: no SEO value, and per-user data must never be cached)
 *   '**'               Client
 */
export const serverRoutes: ServerRoute[] = [
//@@sol
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'reports', renderMode: RenderMode.Prerender },
  {
    path: 'reports/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      return (await fetchPublishedReports()).map(r => ({ slug: r.slug }));
    },
  },
  { path: 'status', renderMode: RenderMode.Server },
  { path: 'console/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
//@@stub
  { path: '**', renderMode: RenderMode.Server },
//@@end
];
