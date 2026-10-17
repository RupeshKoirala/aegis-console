import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { VerdictView } from '../../../shared/domain/models';

export type VerdictResult = { kind: 'ok'; verdict: VerdictView } | { kind: 'invalid'; message: string };

/** Finished. Your job is to test it. */
@Injectable({ providedIn: 'root' })
export class VerdictApi {
  private readonly http = inject(HttpClient);

  check(query: string): Observable<VerdictResult> {
    const q = query.trim().toLowerCase();
    if (!q) return of({ kind: 'invalid', message: 'Enter an IP or domain' });
    return this.http.get<VerdictView>('/api/v1/verdict', { params: { q } }).pipe(
      map(verdict => ({ kind: 'ok' as const, verdict })),
      catchError((err: HttpErrorResponse) =>
        err.status === 400 ? of({ kind: 'invalid' as const, message: err.error?.detail ?? 'Invalid query' }) : throwError(() => err),
      ),
    );
  }
}
