import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgClass, NgForOf, NgIf, NgStyle, NgSwitch } from '@angular/common';
import { Page } from './page';
import { ALERTS } from '../../../shared/domain/sample-data';

describe('M01.05 · legacy directives', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const rows = () => Array.from(el.querySelectorAll<HTMLElement>('tr.alert-row'));
  const clickFilter = async (s: string) => {
    Array.from(el.querySelectorAll<HTMLElement>('button.filter')).find(b => b.textContent?.trim() === s)!.click();
    await f.whenStable();
  };

  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1: imports the legacy directives', () => {
    const d = (Page as any).ɵcmp.dependencies;
    const deps = (typeof d === 'function' ? d() : d) ?? [];
    for (const dir of [NgIf, NgForOf, NgSwitch, NgClass, NgStyle]) expect(deps).toContain(dir);
  });

  it('TODO 3: *ngFor renders a numbered row per visible alert', async () => {
    expect(rows().length).toBe(ALERTS.length);
    expect(rows()[2].querySelector('.n')?.textContent?.trim()).toBe('3');
    expect(rows()[1].textContent).toContain('crypto-miner.example');
    await clickFilter('NEW');
    expect(rows().length).toBe(3);
  });

  it('TODO 2: *ngIf … else shows the ng-template when nothing matches', async () => {
    f.componentInstance.alerts = ALERTS.filter(a => a.status !== 'TRIAGED');
    await clickFilter('TRIAGED');
    expect(rows().length).toBe(0);
    expect(el.querySelector('.none')?.textContent).toContain('No alerts with status TRIAGED');
    expect(el.querySelector('table')).toBeNull();
  });

  it('TODO 4: ngClass object and array forms', () => {
    expect(rows()[1].classList).toContain('odd');
    expect(rows()[0].classList).not.toContain('odd');
    expect(rows()[3].classList).toContain('resolved');
    const sev = rows()[2].querySelector('.sev')!;
    expect(sev.classList).toContain('HIGH');
  });

  it('TODO 5 + 6: ngSwitch shows one icon, ngStyle colours the status', () => {
    const icons = (r: HTMLElement) => Array.from(r.querySelectorAll('.icon')).map(i => i.textContent?.trim());
    expect(icons(rows()[0])).toEqual(['🆕']);
    expect(icons(rows()[1])).toEqual(['🔎']);
    expect(icons(rows()[3])).toEqual(['✅']);
    expect((rows()[0].querySelector('.status') as HTMLElement).style.backgroundColor).toBe('rgb(29, 78, 216)');
  });

  it('TODO 7: *ngIf … as shows the selected alert', async () => {
    expect(el.querySelector('.selected')).toBeNull();
    rows()[1].click();
    await f.whenStable();
    expect(el.querySelector('.selected')?.textContent).toContain('crypto-miner.example');
    expect(el.querySelector('.selected')?.textContent).toContain('analyst@acme.test');
  });
});
