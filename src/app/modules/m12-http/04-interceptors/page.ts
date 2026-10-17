import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestLog, SessionEvents, TenantContext } from './session';

@Component({
  selector: 'app-m12-04',
  template: `
    <h1>Interceptors</h1>
    <p class="muted">Open DevTools → Network to see the headers on each request.</p>
    <div class="row">
      <button (click)="call('/api/v1/lists')">GET lists</button>
      <button (click)="tenant.actingFor.set(tenant.actingFor() ? null : 2)">{{ tenant.actingFor() ? 'Stop acting for Globex' : 'Act for Globex (tenant 2)' }}</button>
      <button (click)="call('/api/v1/lists', 'Bearer expired')">Call with an expired token</button>
    </div>
    @if (session.expired()) { <p class="error-text">Session expired. (M15 will redirect to the login page.)</p> }
    <ul class="card mono">@for (l of log.lines(); track $index) { <li>{{ l }}</li> }</ul>
  `,
})
export class Page {
  private readonly http = inject(HttpClient);
  protected readonly tenant = inject(TenantContext);
  protected readonly session = inject(SessionEvents);
  protected readonly log = inject(RequestLog);
  call(url: string, auth?: string) {
    this.http.get(url, auth ? { headers: { Authorization: auth } } : {}).subscribe({ error: () => {} });
  }
}
