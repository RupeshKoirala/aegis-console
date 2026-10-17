//@@sol
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
//@@stub
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
//@@end
import { IndicatorView, ListView, Page } from '../../../shared/domain/models';

export interface IndicatorQuery { q?: string; page?: number; size?: number; }

@Injectable({ providedIn: 'root' })
export class ListsApi {
//@@sol
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
//@@stub
  // TODO 1: inject HttpClient and GET '/api/v1/lists' typed as ListView[]
  lists(): Observable<ListView[]> {
    return of([]);
  }

  // TODO 2: GET `/api/v1/lists/${listId}/indicators` typed as Page<IndicatorView> with HttpParams:
  //         page (default 0), size (default 10), and q ONLY when it's non-empty after trimming
  indicators(listId: number, query: IndicatorQuery = {}): Observable<Page<IndicatorView>> {
    return of({ items: [], page: 0, size: 10, total: 0 });
  }
//@@end
}
