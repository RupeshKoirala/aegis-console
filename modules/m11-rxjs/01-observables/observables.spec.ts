import { heartbeat, parseFeed } from './streams';

describe('M11.01 · observables from scratch', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1: heartbeat emits on schedule and tears down', () => {
    vi.useFakeTimers();
    const seen: number[] = [];
    const sub = heartbeat(100).subscribe(n => seen.push(n));
    vi.advanceTimersByTime(350);
    expect(seen).toEqual([1, 2, 3]);
    sub.unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('TODO 1: it is cold (each subscriber has its own counter)', () => {
    vi.useFakeTimers();
    const a: number[] = [], b: number[] = [];
    const src = heartbeat(100);
    const s1 = src.subscribe(n => a.push(n));
    vi.advanceTimersByTime(200);
    const s2 = src.subscribe(n => b.push(n));
    vi.advanceTimersByTime(100);
    expect(a).toEqual([1, 2, 3]);
    expect(b).toEqual([1]);
    s1.unsubscribe(); s2.unsubscribe();
  });

  it('TODO 2: parseFeed emits valid lines and completes', () => {
    const out: string[] = [];
    let done = false;
    parseFeed('# c\n203.0.113.66\n\n  Evil.Example \n').subscribe({ next: l => out.push(l), complete: () => (done = true) });
    expect(out).toEqual(['203.0.113.66', 'evil.example']);
    expect(done).toBe(true);
  });

  it('TODO 2: parseFeed errors on the first bad line and stops', () => {
    const out: string[] = [];
    let err = '';
    parseFeed('203.0.113.66\nnot an ioc!\n192.0.2.1').subscribe({ next: l => out.push(l), error: (e: Error) => (err = e.message) });
    expect(out).toEqual(['203.0.113.66']);
    expect(err).toBe('line 2: "not an ioc!" is not an indicator');
  });
});
