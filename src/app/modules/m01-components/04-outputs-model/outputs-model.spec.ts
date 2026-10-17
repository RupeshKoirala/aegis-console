import { TestBed, ComponentFixture } from '@angular/core/testing';
import { IndicatorRow } from './indicator-row';
import { LegacyRow } from './legacy-row';
import { SeverityFilter } from './severity-filter';
import { Page } from './page';
import { INDICATORS } from '../../../shared/domain/sample-data';

const outputsOf = (cls: unknown) => Object.keys((cls as any).ɵcmp.outputs);
const botnet = INDICATORS.find(i => i.value === '203.0.113.66')!;

describe('M01.04 · outputs & model', () => {
  it('TODO 1–2: SeverityFilter is a model (two-way) and toggles immutably', async () => {
    expect(outputsOf(SeverityFilter), 'model() creates a "selectedChange" output').toContain('selectedChange');
    const f = TestBed.createComponent(SeverityFilter);
    const emitted: unknown[] = [];
    (f.componentInstance as any).selected.subscribe((v: unknown) => emitted.push(v));
    await f.whenStable();
    const chips = f.nativeElement.querySelectorAll('.chip');
    chips[0].click();
    chips[1].click();
    chips[0].click();
    await f.whenStable();
    expect(f.componentInstance.selected()).toEqual(['HIGH']);
    expect(emitted).toEqual([['CRITICAL'], ['CRITICAL', 'HIGH'], ['HIGH']]);
    expect(f.nativeElement.querySelector('.chip.on')?.textContent?.trim()).toBe('HIGH');
  });

  it('TODO 3–4: IndicatorRow emits picked and removeRequested (without also picking)', async () => {
    expect(outputsOf(IndicatorRow)).toEqual(expect.arrayContaining(['picked', 'removeRequested']));
    const f = TestBed.createComponent(IndicatorRow);
    f.componentRef.setInput('indicator', botnet);
    await f.whenStable();
    const c = f.componentInstance as any;
    const picked = vi.fn(), removed = vi.fn();
    c.picked.subscribe(picked);
    c.removeRequested.subscribe(removed);
    f.nativeElement.querySelector('.row-item').click();
    f.nativeElement.querySelector('.remove').click();
    expect(picked).toHaveBeenCalledTimes(1);
    expect(picked).toHaveBeenCalledWith(botnet);
    expect(removed).toHaveBeenCalledWith(botnet.id);
  });

  it('TODO 5: LegacyRow has an @Output EventEmitter', async () => {
    expect(outputsOf(LegacyRow)).toContain('removeRequested');
    const f = TestBed.createComponent(LegacyRow);
    f.componentRef.setInput('indicator', botnet);
    await f.whenStable();
    const spy = vi.fn();
    (f.componentInstance as any).removeRequested.subscribe(spy);
    f.nativeElement.querySelector('.remove').click();
    expect(spy).toHaveBeenCalledWith(botnet.id);
  });

  describe('Page', () => {
    let f: ComponentFixture<Page>;
    let el: HTMLElement;
    beforeEach(async () => {
      f = TestBed.createComponent(Page);
      el = f.nativeElement;
      await f.whenStable();
    });

    it('TODO 7: the filter is two-way bound (child → parent and parent → child)', async () => {
      const chips = () => el.querySelectorAll<HTMLElement>('aegis-severity-filter .chip');
      expect(chips().length, '<aegis-severity-filter> missing').toBe(4);
      chips()[0].click();
      await f.whenStable();
      expect(f.componentInstance.severities()).toEqual(['CRITICAL']);
      expect(el.querySelectorAll('aegis-indicator-row').length).toBe(5);
      (el.querySelector('button.reset') as HTMLElement).click();
      await f.whenStable();
      expect(el.querySelectorAll('aegis-severity-filter .chip.on').length).toBe(0);
    });

    it('TODO 6 + 8: rows are wired to pick and remove', async () => {
      const rows = () => el.querySelectorAll<HTMLElement>('aegis-indicator-row .row-item');
      expect(rows().length).toBe(11);
      rows()[0].click();
      await f.whenStable();
      expect(el.querySelector('.picked h3')?.textContent).toBe('203.0.113.66');
      (rows()[0].querySelector('.remove') as HTMLElement).click();
      await f.whenStable();
      expect(rows().length).toBe(10);
      expect(f.componentInstance.picked()).toBeNull();
    });

    it('TODO 9: legacy rows remove through the same handler', async () => {
      const legacy = () => el.querySelectorAll<HTMLElement>('aegis-legacy-row');
      expect(legacy().length).toBe(3);
      (legacy()[0].querySelector('.remove') as HTMLElement).click();
      await f.whenStable();
      expect(f.componentInstance.items().some(i => i.value === '203.0.113.66')).toBe(false);
    });
  });
});
