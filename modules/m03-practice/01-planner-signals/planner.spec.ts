import { TestBed } from '@angular/core/testing';
import { project } from './projection';
import { PlannerService } from './planner.service';
import { Page } from './page';

const INPUT = { currentSize: 250_000, dailyAdditions: 4_000, monthlyGrowthPct: 10, expiryDays: 90, months: 12, capacity: 1_000_000 };

describe('M03.01 · planner (v22)', () => {
  it('TODO 1: project() follows the model', () => {
    const rows = project(INPUT);
    expect(rows.length).toBe(12);
    expect(rows[0]).toEqual({ month: 1, added: 120_000, expired: 83_333, total: 286_667, utilization: 0.286667 });
    expect(rows[1].added).toBe(132_000);
    expect(rows[1].expired).toBe(Math.round(286_667 / 3));
    expect(rows.at(-1)!.month).toBe(12);
    expect(project({ ...INPUT, expiryDays: 15, months: 1 })[0].expired).toBe(250_000);
  });

  it('TODO 2–3: the service derives rows from the last input', () => {
    const s = TestBed.inject(PlannerService);
    expect(s.rows()).toEqual([]);
    s.plan({ ...INPUT, months: 3 });
    expect(s.rows().length).toBe(3);
    expect(s.lastInput()?.months).toBe(3);
    expect(typeof (s.lastInput as any).set).toBe('undefined');
  });

  it('TODO 4–8: typing, submitting and resetting flows through to the table', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    expect(el.querySelector('.empty')).not.toBeNull();

    const months = el.querySelector<HTMLInputElement>('input[name=months]')!;
    months.value = '24';
    months.dispatchEvent(new Event('input'));
    await f.whenStable();
    (el.querySelector('button[type=submit]') as HTMLElement).click();
    await f.whenStable();

    const rows = el.querySelectorAll('tr.result-row');
    expect(rows.length).toBe(24);
    expect(rows[0].textContent).toContain('120,000');
    expect(rows[0].querySelector('.util')?.textContent?.trim()).toBe('28.7%');
    expect(el.querySelectorAll('tr.result-row.warn').length).toBeGreaterThan(0);
    const firstWarn = project({ ...INPUT, months: 24 }).find(r => r.utilization >= 0.8)!.month;
    expect(el.querySelector('tr.result-row.warn td')?.textContent?.trim()).toBe(String(firstWarn));

    (el.querySelector('button.reset') as HTMLElement).click();
    await f.whenStable();
    expect(months.value).toBe('12');
  });
});
