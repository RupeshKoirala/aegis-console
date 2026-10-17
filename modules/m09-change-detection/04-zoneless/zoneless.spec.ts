import { TestBed } from '@angular/core/testing';
import { FeedHealth } from './feed-health';

describe('M09.04 · zoneless audit', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1–3: timer, promise and DOM listener updates all render', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(FeedHealth);
    f.autoDetectChanges();
    await vi.advanceTimersByTimeAsync(600);
    window.dispatchEvent(new Event('offline'));
    await vi.advanceTimersByTimeAsync(50);
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('.last-sync')?.textContent).toContain('12:00 UTC');
    expect(el.querySelector('.entries')?.textContent).toContain('19');
    expect(el.querySelector('.online')?.textContent).toContain('offline');
  });
});
