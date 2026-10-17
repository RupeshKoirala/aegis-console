import { TestBed } from '@angular/core/testing';
import { Page } from './page';

describe('M07.01 · built-in pipes', () => {
  let el: HTMLElement;
  const t = (c: string) => el.querySelector(c)?.textContent?.replace(/\s+/g, ' ').trim();
  beforeEach(async () => {
    const f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 2: dates in UTC', () => {
    expect(t('.d-medium')).toBe('Oct 15, 2026, 11:40:00 AM');
    expect(t('.d-custom')).toBe('2026-10-15 11:40');
  });
  it('TODO 3: case pipes', () => {
    expect(t('.tenant')).toBe('Acme Schools');
    expect(t('.severity')).toBe('CRITICAL');
  });
  it('TODO 4: number, percent, currency', () => {
    expect(t('.num')).toBe('1,285');
    expect(t('.pct')).toBe('86.9%');
    expect(t('.cur')).toBe('$4,200');
  });
  it('TODO 5: slice', () => expect(t('.hash')).toBe('9f86d081884c…'));
  it('TODO 6: i18nPlural / i18nSelect', () => {
    expect(t('.plural')).toBe('3 hits');
    expect(t('.select')).toBe('New, needs triage');
  });
  it('TODO 7: async', () => expect(t('.async')).toBe('42'));
  it('TODO 8: keyvalue (sorted by key) and json', () => {
    expect(Array.from(el.querySelectorAll('.tag')).map(s => s.textContent)).toEqual(['actor=unknown', 'category=Botnets', 'feed=webroot']);
    expect(t('.raw')).toContain('"feed": "webroot"');
  });
});
