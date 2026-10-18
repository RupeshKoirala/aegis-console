import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

const route = (path: string) => serverRoutes.find(r => r.path === path) as ServerRoute & {
  getPrerenderParams?: () => Promise<Record<string, string>[]>; fallback?: PrerenderFallback;
};

describe('M23.02 · render modes', () => {
  it('TODO 1: public pages are prerendered, live ones server-rendered, private ones client-only', () => {
    expect(route('')?.renderMode).toBe(RenderMode.Prerender);
    expect(route('reports')?.renderMode).toBe(RenderMode.Prerender);
    expect(route('status')?.renderMode).toBe(RenderMode.Server);
    expect(route('console/**')?.renderMode).toBe(RenderMode.Client);
    expect(serverRoutes.at(-1)).toEqual({ path: '**', renderMode: RenderMode.Client });
  });

  it('TODO 1: every published report is prerendered; new ones fall back to SSR', async () => {
    const r = route('reports/:slug');
    expect(r?.renderMode).toBe(RenderMode.Prerender);
    expect(r?.fallback).toBe(PrerenderFallback.Server);
    expect(await r!.getPrerenderParams!()).toEqual([
      { slug: '2026-10-botnet-wave' }, { slug: '2026-09-phishing-kits' }, { slug: '2026-08-tor-exits' },
    ]);
  });
});
