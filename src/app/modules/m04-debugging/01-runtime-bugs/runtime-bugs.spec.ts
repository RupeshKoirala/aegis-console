import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { ALERTS } from '../../../shared/domain/sample-data';

describe('M04.01 · runtime bugs', () => {
  const originalIds = ALERTS.map(a => a.id);

  it('bug 3: does not reorder the shared ALERTS array', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    f.componentInstance.newestFirst();
    expect(ALERTS.map(a => a.id)).toEqual(originalIds);
  });

  it('bug 4: every alert is reachable through paging', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    const seen = new Set<string>();
    for (let i = 0; i < 5; i++) {
      el.querySelectorAll('li.alert').forEach(li => seen.add(li.textContent!.trim()));
      (el.querySelector('button.next') as HTMLElement).click();
      await f.whenStable();
    }
    expect(seen.size).toBe(ALERTS.length);
    expect(el.querySelector('.pos')?.textContent).toContain(`of ${Math.ceil(ALERTS.length / 3)}`);
  });

  it('bug 1: rows are tracked by a unique key (no duplicate-key warning)', async () => {
    const warn = vi.spyOn(console, 'warn');
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    expect(warn.mock.calls.some(c => String(c[0]).includes('NG0955'))).toBe(false);
    warn.mockRestore();
  });

  it('bug 2: clearing the selection does not crash and shows the hint', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    (el.querySelector('li.alert') as HTMLElement).click();
    await f.whenStable();
    expect(el.querySelector('.details h3')?.textContent).toBeTruthy();
    (el.querySelector('button.clear') as HTMLElement).click();
    await f.whenStable();
    expect(el.querySelector('.details')?.textContent).toContain('Select an alert');
  });
});
