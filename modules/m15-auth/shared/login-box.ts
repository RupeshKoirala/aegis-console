// Done for you: a compact sign-in box for the M15 pages, so 02–04 work even before you finish 01.
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { LoginResponse, Session } from './session';

@Component({
  selector: 'aegis-login-box',
  template: `
    @if (session.user(); as u) {
      <div class="row card who">
        <span>Signed in as <b>{{ u.email }}</b> · {{ u.role }} · {{ u.tenantName }}</span>
        <button (click)="session.clear()">Forget session</button>
      </div>
    } @else {
      <form class="row card" (submit)="$event.preventDefault(); signIn()">
        <select [value]="email()" (change)="email.set($any($event.target).value)">
          @for (e of users; track e) { <option [value]="e">{{ e }}</option> }
        </select>
        <span class="muted">password123</span>
        <button class="primary">Sign in</button>
        @if (error()) { <span class="error-text">{{ error() }}</span> }
      </form>
    }
  `,
})
export class LoginBox {
  protected readonly session = inject(Session);
  private readonly http = inject(HttpClient);
  protected readonly users = ['admin@acme.test', 'analyst@acme.test', 'viewer@acme.test', 'msp@shieldline.test'];
  readonly email = signal(this.users[0]);
  readonly error = signal('');

  signIn() {
    this.http.post<LoginResponse>('/api/v1/auth/login', { email: this.email(), password: 'password123' }).subscribe({
      next: r => { this.error.set(''); this.session.start(r); },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.detail ?? e.message),
    });
  }
}
