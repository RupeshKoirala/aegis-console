import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormField, form, required, email, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Problem } from '../../../shared/domain/models';
import { Session } from '../shared/session';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-m15-01',
  imports: [FormField, DatePipe],
  template: `
    <h1>Sign in</h1>
    @if (session.user(); as u) {
      <div class="card stack">
        <p>Welcome, <b>{{ u.displayName }}</b> ({{ u.role }}, {{ u.tenantName }}).</p>
        <p class="muted">Access token expires {{ session.expiresAt() | date: 'mediumTime' }}. Reload the page: are you still signed in?</p>
        <button (click)="signOut()">Sign out</button>
      </div>
    } @else {
      <form class="card stack login" (submit)="$event.preventDefault(); signIn()" novalidate>
        <label>Email <input type="email" autocomplete="username" [formField]="f.email" /></label>
        <label>Password <input type="password" autocomplete="current-password" [formField]="f.password" /></label>
        @if (problem(); as p) { <p class="error-text" role="alert">{{ p.detail }}</p> }
        <button class="primary" [disabled]="f().submitting()">Sign in</button>
        <small class="muted">Try admin@acme.test, analyst@acme.test, viewer@acme.test or msp@shieldline.test, password <code>password123</code></small>
      </form>
    }
  `,
  styles: `.login { max-width: 380px; }`,
})
export class Page {
  protected readonly session = inject(Session);
  private readonly auth = inject(AuthService);
  readonly model = signal({ email: 'analyst@acme.test', password: '' });
  readonly f = form(this.model, p => { required(p.email); email(p.email); required(p.password); });
  readonly problem = signal<Problem | null>(null);

  signIn() {
    return submit(this.f, async () => {
      try {
        await firstValueFrom(this.auth.login(this.model().email, this.model().password));
        this.problem.set(null);
        this.model.update(m => ({ ...m, password: '' }));
      } catch (p) {
        this.problem.set(p as Problem);
      }
      return undefined;
    });
  }
  signOut() {
    this.auth.logout().subscribe();
  }
}
