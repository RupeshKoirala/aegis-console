import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { IndicatorView } from '../../../shared/domain/models';

export type SearchApi = (q: string) => Observable<IndicatorView[]>;

export function searchIndicators(query$: Observable<string>, api: SearchApi): Observable<IndicatorView[]> {
  return query$.pipe(
    debounceTime(300),
    map(q => q.trim().toLowerCase()),
    distinctUntilChanged(),
    switchMap(q => (q.length < 2 ? of([]) : api(q).pipe(catchError(() => of([]))))),
  );
}
