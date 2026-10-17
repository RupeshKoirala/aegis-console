import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ListView } from '../../../shared/domain/models';

@Injectable({ providedIn: 'root' })
export class ListsApi {
  private readonly http = inject(HttpClient);

  /**
   * TODO 3: GET /api/v1/lists/{id}, but SHARED: two resolvers asking for the same id during one navigation
   * must cause ONE request. Keep a Map<number, Observable<ListView>> of `request.pipe(shareReplay(1))`.
   * Don't cache failures: on error, delete the entry so the next navigation retries.
   */
  get(id: number): Observable<ListView> {
    return this.http.get<ListView>(`/api/v1/lists/${id}`);
  }
}
