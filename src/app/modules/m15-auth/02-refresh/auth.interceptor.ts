import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse, Session } from '../shared/session';

/**
 * TODO 2: ONE refresh at a time. If five requests 401 together, they must share ONE POST /auth/refresh
 * (the refresh token is single-use, so a second call would fail and sign the user out!).
 *  - POST /api/v1/auth/refresh { refreshToken } → session.start(response) → emit the new access token
 *  - on failure: session.clear() and rethrow
 *  - keep the in-flight observable in a field (shareReplay(1)), and reset it when done (finalize)
 */
@Injectable({ providedIn: 'root' })
export class TokenRefresher {
  private readonly http = inject(HttpClient);
  private readonly session = inject(Session);

  refresh(): Observable<string> {
    return throwError(() => new Error('TODO 2: refresh() is not implemented'));
  }
}

const isAuthCall = (req: HttpRequest<unknown>) => /\/auth\/(login|refresh)$/.test(req.url);

/**
 * TODO 1: attach `Authorization: Bearer <session token>` to /api/ requests (not to login/refresh, and not when signed out).
 * TODO 3: on a 401 (and only if we HAVE a refresh token): refresher.refresh(), then retry the request ONCE with the
 *         new token. Anything else, or a failed refresh: rethrow the original error.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
