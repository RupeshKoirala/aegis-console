import { Observable, timer, map } from 'rxjs';

/** Simulated async work: answers "#id done" after 100 ms. */
export const work = (id: number): Observable<string> => timer(100).pipe(map(() => `#${id} done`));

export const withSwitch = (clicks: Observable<number>) =>
  clicks.pipe(map(id => `TODO 1: switchMap for #${id}`)); // TODO 1: switchMap(work)

export const withConcat = (clicks: Observable<number>) =>
  clicks.pipe(map(id => `TODO 2 #${id}`)); // TODO 2: concatMap(work)

export const withMerge = (clicks: Observable<number>) =>
  clicks.pipe(map(id => `TODO 3 #${id}`)); // TODO 3: mergeMap(work)

export const withExhaust = (clicks: Observable<number>) =>
  clicks.pipe(map(id => `TODO 4 #${id}`)); // TODO 4: exhaustMap(work)

/** Retries a failing source up to 2 more times, waiting 100 ms between attempts. */
export const withRetry = <T>(source: Observable<T>) =>
  source; // TODO 5: source.pipe(retry({ count: 2, delay: 100 }))
