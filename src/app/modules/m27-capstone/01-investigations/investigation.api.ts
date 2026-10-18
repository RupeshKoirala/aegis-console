import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { CreateIndicatorRequest, IndicatorView, ListView, Me, Page, VerdictView } from '../../../shared/domain/models';

/** R1: every request of the feature, typed. (Contract: api/openapi.yaml.) */
@Injectable({ providedIn: 'root' })
export class InvestigationApi {
  private readonly http = inject(HttpClient);
  me(): Observable<Me> {
    return this.http.get<Me>('/api/v1/me');
  }
  verdict(q: string): Observable<VerdictView> {
    return this.http.get<VerdictView>('/api/v1/verdict', { params: { q } });
  }
  list(id: number): Observable<ListView> {
    return this.http.get<ListView>(`/api/v1/lists/${id}`);
  }
  indicators(listId: number, q: string): Observable<IndicatorView[]> {
    const params: Record<string, string | number> = { size: 200 };
    if (q) params['q'] = q;
    return this.http.get<Page<IndicatorView>>(`/api/v1/lists/${listId}/indicators`, { params }).pipe(map(p => p.items));
  }
  add(listId: number, body: CreateIndicatorRequest): Observable<IndicatorView> {
    return this.http.post<IndicatorView>(`/api/v1/lists/${listId}/indicators`, body);
  }
  remove(listId: number, id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/lists/${listId}/indicators/${id}`);
  }
}
