import { TestBed } from '@angular/core/testing';
import { AegisButton } from './aegis-button';
import { StatTile } from './stat-tile';
import { LegacyStatTile } from './legacy-stat-tile';
import { Page } from './page';

describe('M05.01 · host & selectors', () => {
  it('TODO 1: AegisButton uses the attribute selector button[aegisBtn]', () => {
    expect((AegisButton as any).ɵcmp.selectors[0]).toEqual(['button', 'aegisBtn', '']);
  });

  it('TODO 4: StatTile binds role, classes, aria-label and click on its host', async () => {
    const f = TestBed.createComponent(StatTile);
    f.componentRef.setInput('label', 'Entries');
    f.componentRef.setInput('value', 900);
    f.componentRef.setInput('limit', 800);
    await f.whenStable();
    const host: HTMLElement = f.nativeElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.classList).toContain('breach');
    expect(host.getAttribute('aria-label')).toBe('Entries: 900');
    host.click();
    await f.whenStable();
    expect(host.classList).toContain('expanded');
    expect(host.querySelector('.hint')).not.toBeNull();
  });

  it('TODO 5: LegacyStatTile uses @HostBinding and @HostListener', async () => {
    const f = TestBed.createComponent(LegacyStatTile);
    f.componentRef.setInput('value', 4);
    f.componentRef.setInput('limit', 3);
    await f.whenStable();
    const host: HTMLElement = f.nativeElement;
    expect(host.classList).toContain('breach');
    host.click();
    host.click();
    expect((f.componentInstance as any).clicks).toBe(2);
  });

  it('TODO 2, 3, 6: the page uses native buttons enhanced by aegisBtn; busy swallows clicks', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    const save = el.querySelector<HTMLButtonElement>('button.save')!;
    const busy = el.querySelector<HTMLButtonElement>('button.busy');
    expect(save.classList).toContain('aegis-btn');
    expect(save.getAttribute('data-variant')).toBe('primary');
    expect(busy?.getAttribute('aria-busy')).toBe('true');
    expect(busy?.querySelector('.spinner')).not.toBeNull();
    save.click();
    busy!.click();
    await f.whenStable();
    expect(el.querySelector('.saves')?.textContent).toContain('saves: 1');
  });
});
