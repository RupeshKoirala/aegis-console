import { Observable, timer, map } from 'rxjs';
import { concatMap, exhaustMap, mergeMap, retry, switchMap } from 'rxjs/operators';

/** Simulated async work: answers "#id done" after 100 ms. */
export const work = (id: number): Observable<string> => timer(100).pipe(map(() => `#${id} done`));

export const withSwitch = (clicks: Observable<number>) =>
  clicks.pipe(switchMap(work));

export const withConcat = (clicks: Observable<number>) =>
  clicks.pipe(concatMap(work));

export const withMerge = (clicks: Observable<number>) =>
  clicks.pipe(mergeMap(work));

export const withExhaust = (clicks: Observable<number>) =>
  clicks.pipe(exhaustMap(work));

/** Retries a failing source up to 2 more times, waiting 100 ms between attempts. */
export const withRetry = <T>(source: Observable<T>) =>
  source.pipe(retry({ count: 2, delay: 100 }));
