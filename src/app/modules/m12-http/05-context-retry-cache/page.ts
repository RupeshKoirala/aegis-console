import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { CACHE_TTL, clearHttpCache } from './interceptors';

@Component({
  selector: 'app-m12-05',
  template: `
    <h1>Context, retry, cache</h1>
    <div class="row">
      <button (click)="cached()">GET lists (cached 30 s)</button>
      <button (click)="flaky()">GET with chaos (X-Chaos: 0.6)</button>
      <button (click)="clear()">Clear cache</button>
    </div>
    <ul class="card mono">@for (l of log(); track $index) { <li>{{ l }}</li> }</ul>
  `,
})
export class Page {
  private readonly http = inject(HttpClient);
  readonly log = signal<string[]>([]);
  private note(l: string) { this.log.update(x => [l, ...x]); }
  cached() {
    const t = performance.now();
    this.http.get<unknown[]>('/api/v1/lists', { context: new HttpContext().set(CACHE_TTL, 30_000) })
      .subscribe(r => this.note(`${r.length} lists in ${Math.round(performance.now() - t)} ms`));
  }
  flaky() {
    this.http.get('/api/v1/lists', { headers: { 'X-Chaos': '0.6' } }).subscribe({ next: () => this.note('chaos call succeeded (maybe after retries: see Network)'), error: () => this.note('chaos call failed after 3 attempts') });
  }
  clear() { clearHttpCache(); this.note('cache cleared'); }
}
