import { TestBed } from '@angular/core/testing';
import { LegacyPlannerForm } from './legacy-planner-form';
import { LegacyResultsTable } from './legacy-results-table';
import { Page } from './page';

describe('M03.02 · planner (Gen 1)', () => {
  it('TODO 1 + 5: declares @Output calculate and @Input rows', () => {
    expect(Object.keys((LegacyPlannerForm as any).ɵcmp.outputs)).toContain('calculate');
    expect(Object.keys((LegacyResultsTable as any).ɵcmp.inputs)).toContain('rows');
  });

  it('TODO 2: submit emits the field values', async () => {
    const f = TestBed.createComponent(LegacyPlannerForm);
    await f.whenStable();
    const spy = vi.fn();
    (f.componentInstance as any).calculate.subscribe(spy);
    f.componentInstance.months = 3;
    f.componentInstance.submit();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ months: 3, currentSize: 250_000, capacity: 1_000_000 }));
  });

  it('TODO 3–7: typing, submitting and resetting flows through the parent', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    const months = el.querySelector<HTMLInputElement>('input[name=months]')!;
    months.value = '6';
    months.dispatchEvent(new Event('input'));
    await f.whenStable();
    (el.querySelector('aegis-legacy-planner-form button[type=submit]') as HTMLElement).click();
    await f.whenStable();
    const rows = el.querySelectorAll('aegis-legacy-results-table tr.result-row');
    expect(rows.length).toBe(6);
    expect(rows[0].textContent).toContain('120,000');

    (el.querySelector('aegis-legacy-planner-form button.reset') as HTMLElement).click();
    await f.whenStable();
    expect(months.value).toBe('12');
  });
});
