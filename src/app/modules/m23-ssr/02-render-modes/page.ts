import { Component } from '@angular/core';
import { REPORTS } from './reports';

@Component({
  selector: 'app-m23-02',
  template: `
    <h1>Render modes <small class="muted">SSG · SSR · CSR per route</small></h1>
    <p class="muted">The course app is a client-rendered SPA. This exercise's config is for the separate public site you build in the README lab.</p>
    <table class="card">
      <tr><th>Route</th><th>Mode</th><th>Why</th></tr>
      <tr><td><code>/</code>, <code>/reports</code></td><td>Prerender</td><td>public, same for everyone → build once, serve from the CDN</td></tr>
      <tr><td><code>/reports/:slug</code></td><td>Prerender + SSR fallback</td><td>{{ published }} published reports at build time, new ones on first request</td></tr>
      <tr><td><code>/status</code></td><td>Server</td><td>must be fresh on every request</td></tr>
      <tr><td><code>/console/**</code></td><td>Client</td><td>behind login, per-user, never cache</td></tr>
    </table>
  `,
  styles: `table { border-collapse: collapse; } td, th { padding: 6px 10px; text-align: left; border-bottom: 1px solid var(--border); }`,
})
export class Page {
  protected readonly published = REPORTS.filter(r => !r.draft).length;
}
