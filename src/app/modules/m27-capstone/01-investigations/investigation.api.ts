import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateIndicatorRequest, IndicatorView, ListView, Me, Page, VerdictView } from '../../../shared/domain/models';

/** R1: every request of the feature, typed. (Contract: api/openapi.yaml.) */
@Injectable({ providedIn: 'root' })
export class InvestigationApi {
  private readonly http = inject(HttpClient);
  // TODO R1 (see README): me, verdict(q), list(id), indicators(listId, q) (size=200, q only if non-empty, returns .items),
  //                       add(listId, body), remove(listId, id)
  me(): Observable<Me> { return new Observable(); }
  verdict(_q: string): Observable<VerdictView> { return new Observable(); }
  list(_id: number): Observable<ListView> { return new Observable(); }
  indicators(_listId: number, _q: string): Observable<IndicatorView[]> { return new Observable(); }
  add(_listId: number, _body: CreateIndicatorRequest): Observable<IndicatorView> { return new Observable(); }
  remove(_listId: number, _id: number): Observable<void> { return new Observable(); }
}
