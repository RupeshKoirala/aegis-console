import { Subject, of, throwError, timer, map } from 'rxjs';
import { searchIndicators } from './search';
import { INDICATORS } from '../../../shared/domain/sample-data';

describe('M11.02 · search-as-you-type', () => {
  afterEach(() => vi.useRealTimers());

  const setup = (api: (q: string) => any) => {
    vi.useFakeTimers();
    const q$ = new Subject<string>();
    const results: string[][] = [];
    const calls: string[] = [];
    searchIndicators(q$, q => { calls.push(q); return api(q); }).subscribe(r => results.push(r.map(i => i.value)));
    return { q$, results, calls };
  };

  it('debounces and normalises', () => {
    const { q$, calls } = setup(q => of(INDICATORS.filter(i => i.value.includes(q))));
    q$.next('E'); vi.advanceTimersByTime(100);
    q$.next('EV'); vi.advanceTimersByTime(100);
    q$.next(' EVIL '); vi.advanceTimersByTime(300);
    expect(calls).toEqual(['evil']);
  });

  it('skips duplicates and short queries', () => {
    const { q$, calls, results } = setup(q => of(INDICATORS.filter(i => i.value.includes(q))));
    q$.next('evil'); vi.advanceTimersByTime(300);
    q$.next('evil '); vi.advanceTimersByTime(300);
    q$.next('e'); vi.advanceTimersByTime(300);
    expect(calls).toEqual(['evil']);
    expect(results.at(-1)).toEqual([]);
  });

  it('switchMap drops stale responses', () => {
    const { q$, results } = setup(q => timer(q === 'slow' ? 500 : 50).pipe(map(() => [{ value: q }])));
    q$.next('slow'); vi.advanceTimersByTime(300);
    q$.next('fast'); vi.advanceTimersByTime(300);
    vi.advanceTimersByTime(1000);
    expect(results).toEqual([['fast']]);
  });

  it('an API error does not kill the stream', () => {
    const { q$, results } = setup(q => (q === 'boom' ? throwError(() => new Error('503')) : of([{ value: q }])));
    q$.next('boom'); vi.advanceTimersByTime(300);
    q$.next('evil'); vi.advanceTimersByTime(300);
    expect(results).toEqual([[], ['evil']]);
  });
});
