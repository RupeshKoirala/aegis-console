import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ListView } from '../../../shared/domain/models';

@Injectable({ providedIn: 'root' })
export class ListsApi {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<number, Observable<ListView>>();

  /**
   * TODO 3: GET /api/v1/lists/{id}, but SHARED: two resolvers asking for the same id during one navigation
   * must cause ONE request. Keep a Map<number, Observable<ListView>> of `request.pipe(shareReplay(1))`.
   * Don't cache failures: on error, delete the entry so the next navigation retries.
   */
  get(id: number): Observable<ListView> {
    let cached = this.cache.get(id);
    if (!cached) {
      cached = this.http.get<ListView>(`/api/v1/lists/${id}`).pipe(shareReplay(1));
      this.cache.set(id, cached);
      cached.subscribe({ error: () => this.cache.delete(id) });
    }
    return cached;
  }
}
