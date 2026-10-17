import { TestBed } from '@angular/core/testing';
import { Page, analytics } from './page';

describe('M10.03 · untracked & cleanup', () => {
  beforeEach(() => { analytics.length = 0; vi.useFakeTimers(); });
  afterEach(() => vi.useRealTimers());

  it('TODO 1–3: debounces, logs once, and ignores user changes', async () => {
    const f = TestBed.createComponent(Page);
    const c = f.componentInstance;
    for (const q of ['2', '20', '203']) {
      c.query.set(q);
      TestBed.tick();
      await vi.advanceTimersByTimeAsync(100);
    }
    await vi.advanceTimersByTimeAsync(400);
    expect(analytics).toEqual(['search "203" by analyst@acme.test']);
    c.user.set('admin@acme.test');
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(400);
    expect(analytics.length, 'changing the user must not log a search').toBe(1);
  });

  it('TODO 3: a pending log is cancelled on destroy', async () => {
    const f = TestBed.createComponent(Page);
    f.componentInstance.query.set('evil');
    TestBed.tick();
    f.destroy();
    await vi.advanceTimersByTimeAsync(500);
    expect(analytics).toEqual([]);
  });
});
