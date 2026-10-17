import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
//@@sol
import { Observable, shareReplay } from 'rxjs';
//@@stub
import { Observable } from 'rxjs';
//@@end
import { ListView } from '../../../shared/domain/models';

@Injectable({ providedIn: 'root' })
export class ListsApi {
  private readonly http = inject(HttpClient);
//@@sol
  private readonly cache = new Map<number, Observable<ListView>>();
//@@end

  /**
   * TODO 3: GET /api/v1/lists/{id}, but SHARED: two resolvers asking for the same id during one navigation
   * must cause ONE request. Keep a Map<number, Observable<ListView>> of `request.pipe(shareReplay(1))`.
   * Don't cache failures: on error, delete the entry so the next navigation retries.
   */
  get(id: number): Observable<ListView> {
//@@sol
    let cached = this.cache.get(id);
    if (!cached) {
      cached = this.http.get<ListView>(`/api/v1/lists/${id}`).pipe(shareReplay(1));
      this.cache.set(id, cached);
      cached.subscribe({ error: () => this.cache.delete(id) });
    }
    return cached;
//@@stub
    return this.http.get<ListView>(`/api/v1/lists/${id}`);
//@@end
  }
}
