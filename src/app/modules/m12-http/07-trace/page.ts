import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TraceLog } from './trace-log';

type Scenario = 'ok' | '401' | 'cancel';

@Component({
  selector: 'app-m12-07',
  template: `
    <h1>Trace the onion <small class="muted">watch your interceptors run</small></h1>
    <p class="muted">This route's HttpClient uses <code>TRACE_CHAIN</code>. Each button sends a real request to the fake API and records every step with its time.</p>
    <div class="row card">
      <button (click)="run('ok')">200 OK</button>
      <button (click)="run('401')">401 (?_fail=401)</button>
      <button (click)="run('cancel')">Cancel after 50 ms (server takes 1.5 s)</button>
    </div>
    <ol class="card trace">
      @for (e of log.entries(); track $index) {
        <li class="row" [class.comp]="e.label.startsWith('component')">
          <span class="mono ms">{{ e.ms }} ms</span>
          <span class="mono">{{ e.label }}</span>
          <span class="muted">{{ explain(e.label) }}</span>
        </li>
      } @empty { <li class="muted">Press a button.</li> }
    </ol>
    <p class="muted">Compare with the README: way out = top to bottom, way back = bottom to top, and loading:finalize is always last.</p>
  `,
  styles: `.trace li { gap: 14px; padding: 4px 0; } .ms { min-width: 64px; text-align: right; font-variant-numeric: tabular-nums; } .comp { font-weight: 600; }`,
})
export class Page {
  protected readonly log = inject(TraceLog);
  private readonly http = inject(HttpClient);
  private sub?: Subscription;

  run(s: Scenario) {
    this.sub?.unsubscribe();
    this.log.start();
    const params: Record<string, string> = s === '401' ? { _fail: '401' } : s === 'cancel' ? { _delay: '1500' } : {};
    this.log.add('component:subscribe');
    this.sub = this.http.get('/api/v1/lists', { params }).subscribe({
      next: () => this.log.add('component:next'),
      error: e => this.log.add(`component:error ${e.status}`),
    });
    this.log.add('component:after-subscribe');
    if (s === 'cancel') setTimeout(() => { this.log.add('component:unsubscribe'); this.sub?.unsubscribe(); }, 50);
  }

  explain(label: string): string {
    const map: Record<string, string> = {
      'component:subscribe': 'you call .subscribe(): the chain starts NOW',
      'loading:out': 'way out · spinner +1',
      'auth:out': 'way out · token stamped on a clone',
      'unauth:out': 'way out · catchError attached, nothing else',
      'component:after-subscribe': 'subscribe() returned before any data ("B" before "C")',
      'auth:back': 'way back · the response passes',
      'component:next': 'your next callback gets the data',
      'loading:finalize': 'way back · spinner −1, always last',
      'component:unsubscribe': 'you leave: the request is aborted',
      'auth:back-error': 'way back · an error passes',
    };
    return map[label] ?? (label.startsWith('unauth:caught') ? 'way back · 401 caught, logout, rethrow' : label.startsWith('component:error') ? 'your error callback' : '');
  }
}
