import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { LoginBox } from '../shared/login-box';
import { Session } from '../shared/session';

@Component({
  selector: 'app-m15-02',
  imports: [LoginBox, DatePipe],
  template: `
    <h1>Token refresh <small class="muted">this route's HttpClient uses YOUR authInterceptor</small></h1>
    <aegis-login-box />
    <div class="row card">
      <button (click)="callMe()">GET /me</button>
      <button (click)="burst()">3 requests at once</button>
      <button class="danger" (click)="breakToken()">Break my access token</button>
    </div>
    <p class="muted">token: <span class="mono">{{ (session.token() ?? 'none').slice(0, 24) }}…</span>
      · refresh: <span class="mono">{{ (session.refreshToken() ?? 'none').slice(0, 10) }}…</span>
      · expires {{ session.expiresAt() | date: 'mediumTime' }}</p>
    <ol class="card log mono">@for (l of log(); track $index) { <li>{{ l }}</li> }</ol>
    <p class="muted">Break the token, then call /me: the Network tab should show 401 → /auth/refresh → retry → 200. With "3 at once": three 401s, ONE refresh, three retries.</p>
  `,
})
export class Page {
  protected readonly session = inject(Session);
  private readonly http = inject(HttpClient);
  readonly log = signal<string[]>([]);
  private write = (l: string) => this.log.update(x => [`${new Date().toLocaleTimeString()} ${l}`, ...x].slice(0, 12));

  callMe() {
    this.http.get<{ email: string }>('/api/v1/me').subscribe({
      next: me => this.write(`200 /me → ${me.email}`),
      error: (e: HttpErrorResponse) => this.write(`${e.status} /me → ${e.error?.detail ?? e.message}`),
    });
  }
  burst() {
    forkJoin([this.http.get('/api/v1/me'), this.http.get('/api/v1/lists'), this.http.get('/api/v1/alerts')]).subscribe({
      next: () => this.write('200 ×3'),
      error: (e: HttpErrorResponse) => this.write(`${e.status} burst → ${e.error?.detail ?? e.message}`),
    });
  }
  breakToken() {
    this.session.token.set('expired.or.tampered');
    this.write('access token replaced with garbage');
  }
}
