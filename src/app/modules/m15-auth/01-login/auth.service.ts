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
    // TODO 3: persistence
    //   a) restore(): read STORAGE_KEY; if present AND expiresAt is in the future, put it back into the Session signals
    //      (token, refreshToken, user, expiresAt). Garbage or expired → remove the key.
    //   b) an effect() that writes { token, refreshToken, user, expiresAt } to storage whenever the token changes,
    //      and removes the key when the token becomes null.
  }


  /**
   * TODO 1: POST /api/v1/auth/login { email, password } → session.start(response) → emit the user.
   * Errors: emit a Problem (use the API's problem body; fall back to { title, status, detail: message, instance: '' }).
   * Never keep the password anywhere.
   */
  login(email: string, password: string): Observable<Me> {
    return throwError(() => ({ title: 'TODO', status: 0, detail: 'login() is not implemented yet', instance: '' }) as Problem);
  }

  /**
   * TODO 2: POST /api/v1/auth/logout (204) so the server revokes the token. The training interceptor would sign
   * this request as admin, so set the Authorization header yourself: `Bearer <token>`.
   * Clear the session WHETHER OR NOT the request succeeds (finalize), and complete without erroring.
   */
  logout(): Observable<void> {
    return new Observable<void>(s => s.complete());
  }
}
