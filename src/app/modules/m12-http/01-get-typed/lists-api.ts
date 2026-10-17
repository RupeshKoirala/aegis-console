import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IndicatorView, ListView, Page } from '../../../shared/domain/models';

export interface IndicatorQuery { q?: string; page?: number; size?: number; }

@Injectable({ providedIn: 'root' })
export class ListsApi {
  // TODO 1: inject HttpClient and GET '/api/v1/lists' typed as ListView[]
  lists(): Observable<ListView[]> {
    return of([]);
  }

  // TODO 2: GET `/api/v1/lists/${listId}/indicators` typed as Page<IndicatorView> with HttpParams:
  //         page (default 0), size (default 10), and q ONLY when it's non-empty after trimming
  indicators(listId: number, query: IndicatorQuery = {}): Observable<Page<IndicatorView>> {
    return of({ items: [], page: 0, size: 10, total: 0 });
  }
}
