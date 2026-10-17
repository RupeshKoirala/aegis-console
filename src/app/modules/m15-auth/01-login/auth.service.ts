import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, InjectionToken, effect, inject } from '@angular/core';
import { Observable, finalize, map, throwError, catchError } from 'rxjs';
import { Me, Problem } from '../../../shared/domain/models';
import { LoginResponse, Session } from '../shared/session';

/** Where the session survives a page reload. A token so tests (and a later "remember me") can swap it. */
export const AUTH_STORAGE = new InjectionToken<Storage>('AUTH_STORAGE', { factory: () => sessionStorage });
export const STORAGE_KEY = 'aegis.session';

interface Stored { token: string; refreshToken: string; user: Me; expiresAt: number }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(Session);
  private readonly storage = inject(AUTH_STORAGE);

  constructor() {
    this.restore();
    effect(() => {
      const token = this.session.token();
      if (!token) {
        this.storage.removeItem(STORAGE_KEY);
        return;
      }
      const stored: Stored = { token, refreshToken: this.session.refreshToken()!, user: this.session.user()!, expiresAt: this.session.expiresAt() };
      this.storage.setItem(STORAGE_KEY, JSON.stringify(stored));
    });
  }

  private restore() {
    try {
      const s = JSON.parse(this.storage.getItem(STORAGE_KEY) ?? 'null') as Stored | null;
      if (s && s.expiresAt > Date.now()) {
        this.session.token.set(s.token);
        this.session.refreshToken.set(s.refreshToken);
        this.session.user.set(s.user);
        this.session.expiresAt.set(s.expiresAt);
        return;
      }
    } catch { /* corrupted: fall through */ }
    this.storage.removeItem(STORAGE_KEY);
  }

  /**
   * TODO 1: POST /api/v1/auth/login { email, password } → session.start(response) → emit the user.
   * Errors: emit a Problem (use the API's problem body; fall back to { title, status, detail: message, instance: '' }).
   * Never keep the password anywhere.
   */
  login(email: string, password: string): Observable<Me> {
    return this.http.post<LoginResponse>('/api/v1/auth/login', { email: email.trim().toLowerCase(), password }).pipe(
      map(r => {
        this.session.start(r);
        return r.user;
      }),
      catchError((e: HttpErrorResponse) =>
        throwError((): Problem => e.error?.status ? e.error : { title: e.statusText || 'Error', status: e.status, detail: e.message, instance: '' })),
    );
  }

  /**
   * TODO 2: POST /api/v1/auth/logout (204) so the server revokes the token. The training interceptor would sign
   * this request as admin, so set the Authorization header yourself: `Bearer <token>`.
   * Clear the session WHETHER OR NOT the request succeeds (finalize), and complete without erroring.
   */
  logout(): Observable<void> {
    const token = this.session.token();
    return this.http.post<void>('/api/v1/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } }).pipe(
      catchError(() => [undefined]),
      finalize(() => this.session.clear()),
    );
  }
}
