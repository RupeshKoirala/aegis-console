import { TestBed } from '@angular/core/testing';
import { ConsoleHeader } from './console-header';
import { TenantBadge } from './tenant-badge';
import { Page } from './page';

const def = (cls: unknown) => (cls as any).ɵcmp;
const deps = (cls: unknown) => { const d = def(cls)?.dependencies; return (typeof d === 'function' ? d() : d) ?? []; };

describe('M00.02 · first components', () => {
  it('TODO 1: ConsoleHeader is a component <aegis-console-header>', () => {
    expect(def(ConsoleHeader), 'missing @Component on ConsoleHeader').toBeDefined();
    expect(def(ConsoleHeader).selectors[0][0]).toBe('aegis-console-header');
  });

  it('TODO 2: TenantBadge is a component <aegis-tenant-badge> with the badge markup', async () => {
    expect(def(TenantBadge), 'missing @Component on TenantBadge').toBeDefined();
    expect(def(TenantBadge).selectors[0][0]).toBe('aegis-tenant-badge');
    const f = TestBed.createComponent(TenantBadge);
    await f.whenStable();
    expect(f.nativeElement.querySelector('.badge')?.textContent).toContain('Acme Schools');
  });

  it('TODO 3: the page imports both components', () => {
    expect(deps(Page)).toContain(ConsoleHeader);
    expect(deps(Page)).toContain(TenantBadge);
  });

  it('TODO 4: renders one header and two badges', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelectorAll('aegis-console-header h1').length).toBe(1);
    expect(el.querySelectorAll('aegis-tenant-badge .badge').length).toBe(2);
    expect(el.querySelector('.tenant aegis-tenant-badge')).not.toBeNull();
    expect(el.querySelector('footer aegis-tenant-badge')).not.toBeNull();
  });
});
