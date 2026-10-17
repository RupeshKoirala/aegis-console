import { Observable, of } from 'rxjs';
//@@sol
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
//@@end
import { IndicatorView } from '../../../shared/domain/models';

export type SearchApi = (q: string) => Observable<IndicatorView[]>;

export function searchIndicators(query$: Observable<string>, api: SearchApi): Observable<IndicatorView[]> {
//@@sol
  return query$.pipe(
    debounceTime(300),
    map(q => q.trim().toLowerCase()),
    distinctUntilChanged(),
    switchMap(q => (q.length < 2 ? of([]) : api(q).pipe(catchError(() => of([]))))),
  );
//@@stub
  // TODO 1: debounceTime(300) → map(trim + lower-case) → distinctUntilChanged()
  //         → switchMap: queries shorter than 2 chars give of([]); otherwise api(q) with catchError(() => of([])) INSIDE
  return of([]);
//@@end
}
