import { TestBed } from '@angular/core/testing';
import { WATCHLIST_KEY, WatchlistService } from './watchlist.service';
import { Page } from './page';

describe('M01.06 · first service', () => {
  beforeEach(() => localStorage.clear());

  it('TODO 1: is provided in root (one shared instance)', () => {
    const a = TestBed.inject(WatchlistService);
    const b = TestBed.inject(WatchlistService);
    expect(a).toBe(b);
  });

  it('TODO 2–3 + 5: toggles, reports and exposes read-only state', () => {
    const s = TestBed.inject(WatchlistService) as any;
    s.toggle(7);
    s.toggle(9);
    expect(s.has(7)).toBe(true);
    expect(s.count()).toBe(2);
    expect(s.watched()).toEqual([7, 9]);
    expect(typeof s.watched.set, 'watched must be read-only (asReadonly)').toBe('undefined');
    s.toggle(7);
    expect(s.watched()).toEqual([9]);
    s.clear();
    expect(s.count()).toBe(0);
  });

  it('TODO 4: persists to localStorage through an effect', async () => {
    const s = TestBed.inject(WatchlistService);
    s.toggle(12);
    TestBed.tick();
    expect(localStorage.getItem(WATCHLIST_KEY)).toBe('[12]');
  });

  it('TODO 6: picker and panel share the same state', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    const toggles = el.querySelectorAll<HTMLElement>('aegis-indicator-picker .toggle');
    toggles[0].click();
    toggles[2].click();
    await f.whenStable();
    expect(el.querySelectorAll('aegis-watchlist-panel .watched').length).toBe(2);
    expect(el.querySelector('aegis-watchlist-panel .count')?.textContent).toContain('2');
    (el.querySelector('aegis-watchlist-panel .clear') as HTMLElement).click();
    await f.whenStable();
    expect(el.querySelector('aegis-indicator-picker .toggle.on')).toBeNull();
  });
});
