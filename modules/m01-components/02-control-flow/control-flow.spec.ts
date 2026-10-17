import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';
import { INDICATORS } from '../../../shared/domain/sample-data';

describe('M01.02 · control flow', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const $$ = (s: string) => Array.from(el.querySelectorAll(s)) as HTMLElement[];
  const text = (s: string) => el.querySelector(s)?.textContent?.trim() ?? '';
  const clickKind = async (k: string) => { $$('button.kind').find(b => b.textContent?.trim() === k)!.click(); await f.whenStable(); };

  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1: renders one filter button per kind and filters', async () => {
    expect($$('button.kind').map(b => b.textContent?.trim())).toEqual(['ALL', 'ALLOW', 'BLOCK', 'THREAT']);
    await clickKind('BLOCK');
    expect($$('button.kind.on').map(b => b.textContent?.trim())).toEqual(['BLOCK']);
    expect(f.componentInstance.kindFilter()).toBe('BLOCK');
  });

  it('TODO 2: @let total with singular/plural', async () => {
    expect(text('.total')).toBe(`${INDICATORS.length} indicators`);
    f.componentInstance.kindFilter.set('ALLOW');
    f.componentInstance.onlyScored.set(false);
    await f.whenStable();
    expect(text('.total')).toBe('2 indicators');
    await clickKind('BLOCK');
    f.componentInstance.onlyScored.set(true);
    await f.whenStable();
    expect(text('.total')).toBe('0 indicators');
  });

  it('TODO 3: one numbered, striped row per visible indicator', async () => {
    const rows = $$('tr.ind-row');
    expect(rows.length).toBe(INDICATORS.length);
    expect(rows[0].querySelector('.n')?.textContent?.trim()).toBe('1');
    expect(rows[2].querySelector('.n')?.textContent?.trim()).toBe('3');
    expect(rows[1].classList).toContain('odd');
    expect(rows[0].classList).not.toContain('odd');
    await clickKind('THREAT');
    expect($$('tr.ind-row').length).toBe(11);
    expect($$('tr.ind-row')[0].textContent).toContain('203.0.113.66');
  });

  it('TODO 3: @empty when nothing matches', async () => {
    await clickKind('ALLOW');
    f.componentInstance.onlyScored.set(true);
    await f.whenStable();
    expect($$('tr.ind-row').length).toBe(0);
    expect(text('td.empty')).toBe('No indicators match these filters');
  });

  it('TODO 4: @switch shows exactly one matching icon', () => {
    const rows = $$('tr.ind-row');
    expect(rows[0].querySelectorAll('.kind-icon').length).toBe(1);
    expect(rows[0].querySelector('.kind-icon')?.classList).toContain('allow');
    expect(rows[2].querySelector('.kind-icon')?.classList).toContain('block');
    expect(rows[6].querySelector('.kind-icon')?.classList).toContain('threat');
    expect(rows[6].textContent).toContain('Webroot sample');
  });

  it('TODO 5 + 6: @if … as, @else, nested @if', async () => {
    expect(el.querySelector('.hint')).not.toBeNull();
    $$('tr.ind-row')[2].click(); // 203.0.113.7 – no category
    await f.whenStable();
    expect(el.querySelector('.hint')).toBeNull();
    expect(text('.details h3')).toBe('203.0.113.7');
    expect(text('.details p')).toBe('Phishing landing page');
    expect(el.querySelector('.details .cat')).toBeNull();
    expect($$('tr.ind-row')[2].classList).toContain('active');

    $$('tr.ind-row')[6].click(); // 203.0.113.66 Botnets 97
    await f.whenStable();
    expect(text('.details .cat')).toBe('Botnets · score 97');
  });
});
