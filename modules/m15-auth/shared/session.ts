// Done for you: the session STATE. M15.01 builds the AuthService that fills it; 02–04 read it.
import { Injectable, computed, signal } from '@angular/core';
import { Me } from '../../../shared/domain/models';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  /** seconds until `token` expires */
  expiresIn: number;
  user: Me;
}

@Injectable({ providedIn: 'root' })
export class Session {
  readonly token = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly user = signal<Me | null>(null);
  /** epoch ms when the access token expires */
  readonly expiresAt = signal(0);

  readonly isAuthenticated = computed(() => !!this.token() && !!this.user());
  readonly role = computed(() => this.user()?.role ?? null);

  start(r: LoginResponse, now = Date.now()) {
    this.token.set(r.token);
    this.refreshToken.set(r.refreshToken);
    this.user.set(r.user);
    this.expiresAt.set(now + r.expiresIn * 1000);
  }

  clear() {
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    this.expiresAt.set(0);
  }
}
