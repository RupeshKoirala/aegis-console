import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, effect, inject } from '@angular/core';
import { ListView } from '../../../shared/domain/models';
import { LoginBox } from '../shared/login-box';
import { Session } from '../shared/session';
import { TenantContext } from './tenant-context';
import { IdleTimeout } from './idle-timeout';

@Component({
  selector: 'app-m15-04',
  imports: [LoginBox],
  host: { '(document:mousemove)': 'idle.activity()', '(document:keydown)': 'idle.activity()' },
  template: `
    <h1>MSP tenant switch & session timeout</h1>
    <aegis-login-box />
    @if (idle.secondsLeft(); as s) { <div class="card warn" role="alert">No activity: signing out in {{ s }} s. Move the mouse to stay.</div> }
    @if (idle.expired()) { <div class="card warn">You were signed out after inactivity.</div> }
    @if (session.user()) {
      <div class="row card">
        <span>Acting for <b>{{ tenants.label() }}</b></span>
        @if (tenants.children.value().length) {
          <select (change)="pick(+$any($event.target).value)">
            <option value="0">{{ session.user()?.tenantName }} (own)</option>
            @for (t of tenants.children.value(); track t.id) { <option [value]="t.id">{{ t.name }}</option> }
          </select>
        } @else { <span class="muted">(sign in as msp@shieldline.test to switch tenants)</span> }
      </div>
      <ul class="card">
        @if (lists.error(); as e) { <li class="error-text">{{ problem(e) }}</li> }
        @for (l of lists.value(); track l.id) { <li>{{ l.name }} <span class="badge">{{ l.kind }}</span></li> }
      </ul>
    }
  `,
})
export class Page {
  protected readonly session = inject(Session);
  protected readonly tenants = inject(TenantContext);
  protected readonly idle = inject(IdleTimeout);
  /** Re-fetches whenever the acting tenant changes: the interceptor reads the same signal. */
  readonly lists = httpResource<ListView[]>(() => {
    this.tenants.actingFor();
    return this.session.isAuthenticated() ? '/api/v1/lists' : undefined;
  }, { defaultValue: [] });

  constructor() {
    effect(() => (this.session.isAuthenticated() ? this.idle.start() : this.idle.stop()));
  }
  pick(id: number) {
    this.tenants.actingFor.set(this.tenants.children.value().find(t => t.id === id) ?? null);
  }
  problem(e: unknown) {
    return e instanceof HttpErrorResponse ? (e.error?.detail ?? e.message) : String(e);
  }
}
