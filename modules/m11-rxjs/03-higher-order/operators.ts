import { Observable, timer, map } from 'rxjs';
//@@sol
import { concatMap, exhaustMap, mergeMap, retry, switchMap } from 'rxjs/operators';
//@@end

/** Simulated async work: answers "#id done" after 100 ms. */
export const work = (id: number): Observable<string> => timer(100).pipe(map(() => `#${id} done`));

export const withSwitch = (clicks: Observable<number>) =>
//@@sol
  clicks.pipe(switchMap(work));
//@@stub
  clicks.pipe(map(id => `TODO 1: switchMap for #${id}`)); // TODO 1: switchMap(work)
//@@end

export const withConcat = (clicks: Observable<number>) =>
//@@sol
  clicks.pipe(concatMap(work));
//@@stub
  clicks.pipe(map(id => `TODO 2 #${id}`)); // TODO 2: concatMap(work)
//@@end

export const withMerge = (clicks: Observable<number>) =>
//@@sol
  clicks.pipe(mergeMap(work));
//@@stub
  clicks.pipe(map(id => `TODO 3 #${id}`)); // TODO 3: mergeMap(work)
//@@end

export const withExhaust = (clicks: Observable<number>) =>
//@@sol
  clicks.pipe(exhaustMap(work));
//@@stub
  clicks.pipe(map(id => `TODO 4 #${id}`)); // TODO 4: exhaustMap(work)
//@@end

/** Retries a failing source up to 2 more times, waiting 100 ms between attempts. */
export const withRetry = <T>(source: Observable<T>) =>
//@@sol
  source.pipe(retry({ count: 2, delay: 100 }));
//@@stub
  source; // TODO 5: source.pipe(retry({ count: 2, delay: 100 }))
//@@end
