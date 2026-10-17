import { TestBed } from '@angular/core/testing';
import { LegacyFeedStatus } from './legacy-feed-status';
import { ThrottledCounter } from './throttled-counter';

describe('M09.03 · ChangeDetectorRef', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1: markForCheck makes the timer update visible', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(LegacyFeedStatus);
    f.autoDetectChanges();
    expect(f.nativeElement.textContent).toContain('syncing');
    await vi.advanceTimersByTimeAsync(1100);
    expect(f.nativeElement.textContent).toContain('up to date');
  });

  it('TODO 2–3: renders at most every 500 ms, and not in between', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(ThrottledCounter);
    f.autoDetectChanges();
    const shown = () => Number(f.nativeElement.querySelector('strong').textContent);
    await vi.advanceTimersByTimeAsync(510);
    const first = shown();
    expect(first).toBeGreaterThanOrEqual(20);
    await vi.advanceTimersByTimeAsync(200);
    expect(shown(), 'should not re-render between the 500 ms ticks').toBe(first);
    await vi.advanceTimersByTimeAsync(400);
    expect(shown()).toBeGreaterThan(first);
  });
});
