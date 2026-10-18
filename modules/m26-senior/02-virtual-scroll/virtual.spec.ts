import { TestBed } from '@angular/core/testing';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { buildIndex, generateIndicators, search } from './big-list';
import { Page } from './page';

const DATA = generateIndicators(100_000);

describe('M26.02 · big lists', () => {
  it('TODO 1: one lower-cased haystack per row', () => {
    const idx = buildIndex(DATA.slice(0, 3));
    expect(idx.haystack).toEqual(['10.0.0.0 botnets', '10.0.0.1 phishing', '10.0.0.2 scanners']);
  });

  it('TODO 2: search is case-insensitive, matches category too, and fast', () => {
    const idx = buildIndex(DATA);
    expect(search(idx, '10.1.134.160').map(r => r.value)).toEqual(DATA.filter(r => r.value.includes('10.1.134.160')).map(r => r.value));
    expect(search(idx, '  PHISHING ').length).toBe(DATA.filter(r => r.category === 'Phishing').length);
    expect(search(idx, '', 95).every(r => r.score! >= 95)).toBe(true);
    const t = performance.now();
    for (let i = 0; i < 5; i++) search(idx, 'tor proxy', 50);
    expect((performance.now() - t) / 5).toBeLessThan(80);
  });

  it('TODO 3: only a window of rows is in the DOM', async () => {
    const f = TestBed.createComponent(Page);
    f.autoDetectChanges();
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('cdk-virtual-scroll-viewport')).toBeTruthy();
    expect(el.querySelectorAll('.row-item').length).toBeLessThan(100);
    expect(el.querySelector('.count')?.textContent).toContain('100,000');
  });

  it('TODO 4: jumpTo scrolls the viewport', async () => {
    const f = TestBed.createComponent(Page);
    f.autoDetectChanges();
    await f.whenStable();
    const vp = f.debugElement.query(d => d.componentInstance instanceof CdkVirtualScrollViewport)?.componentInstance as CdkVirtualScrollViewport;
    const spy = vi.spyOn(vp, 'scrollToIndex').mockImplementation(() => {}); // jsdom has no real scrolling
    f.componentInstance.jumpTo(50_000);
    expect(spy).toHaveBeenCalledWith(50_000);
  });
});
