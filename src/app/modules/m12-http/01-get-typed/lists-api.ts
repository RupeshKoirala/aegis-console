import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IndicatorView, ListView, Page } from '../../../shared/domain/models';

export interface IndicatorQuery { q?: string; page?: number; size?: number; }

@Injectable({ providedIn: 'root' })
export class ListsApi {
  private readonly http = inject(HttpClient);

  lists(): Observable<ListView[]> {
    return this.http.get<ListView[]>('/api/v1/lists');
  }

  indicators(listId: number, query: IndicatorQuery = {}): Observable<Page<IndicatorView>> {
    let params = new HttpParams().set('page', query.page ?? 0).set('size', query.size ?? 10);
    const q = query.q?.trim();
    if (q) params = params.set('q', q);
    return this.http.get<Page<IndicatorView>>(`/api/v1/lists/${listId}/indicators`, { params });
  }
}
