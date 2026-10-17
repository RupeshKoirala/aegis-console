import { Subject, defer, of, throwError } from 'rxjs';
import { withConcat, withExhaust, withMerge, withRetry, withSwitch } from './operators';

const race = (op: (c: Subject<number>) => any) => {
  vi.useFakeTimers();
  const clicks = new Subject<number>();
  const out: string[] = [];
  op(clicks).subscribe((v: string) => out.push(`${Date.now() - start}:${v}`));
  const start = Date.now();
  clicks.next(1);
  vi.advanceTimersByTime(50); clicks.next(2);
  vi.advanceTimersByTime(70); clicks.next(3);
  vi.advanceTimersByTime(1000);
  return out;
};

describe('M11.03 · higher-order operators', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1: switchMap keeps only the latest', () => expect(race(withSwitch)).toEqual(['220:#3 done']));
  it('TODO 2: concatMap queues in order', () => expect(race(withConcat)).toEqual(['100:#1 done', '200:#2 done', '300:#3 done']));
  it('TODO 3: mergeMap runs in parallel', () => expect(race(withMerge)).toEqual(['100:#1 done', '150:#2 done', '220:#3 done']));
  it('TODO 4: exhaustMap ignores clicks while busy', () => expect(race(withExhaust)).toEqual(['100:#1 done', '220:#3 done']));

  it('TODO 5: retry 2 more times with a delay, then give up', () => {
    vi.useFakeTimers();
    let attempts = 0;
    const flaky = (failures: number) => defer(() => (++attempts <= failures ? throwError(() => new Error('503')) : of('ok')));
    let result = '';
    withRetry(flaky(2)).subscribe(v => (result = v));
    vi.advanceTimersByTime(250);
    expect(result).toBe('ok');
    expect(attempts).toBe(3);
    attempts = 0;
    let error = '';
    withRetry(flaky(5)).subscribe({ error: (e: Error) => (error = e.message) });
    vi.advanceTimersByTime(500);
    expect(attempts).toBe(3);
    expect(error).toBe('503');
  });
});
