import { Observable, of } from 'rxjs';
import { IndicatorView } from '../../../shared/domain/models';

export type SearchApi = (q: string) => Observable<IndicatorView[]>;

export function searchIndicators(query$: Observable<string>, api: SearchApi): Observable<IndicatorView[]> {
  // TODO 1: debounceTime(300) → map(trim + lower-case) → distinctUntilChanged()
  //         → switchMap: queries shorter than 2 chars give of([]); otherwise api(q) with catchError(() => of([])) INSIDE
  return of([]);
}
