import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { SeverityHighlight } from './severity-highlight';

describe('M06.01 · attribute directive', () => {
  it('TODO 1–2: a directive with selector [aegisSeverity] and an aliased input', () => {
    const dir = (SeverityHighlight as any).ɵdir;
    expect(dir, 'missing @Directive').toBeDefined();
    expect(dir.selectors[0]).toEqual(['', 'aegisSeverity', '']);
    expect(Object.keys(dir.inputs)).toContain('aegisSeverity');
  });

  it('TODO 1: host bindings set the edge and the tooltip', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const row = f.nativeElement.querySelector('tr.alert-row') as HTMLElement;
    expect(row.style.borderLeft).toContain('var(--critical)');
    expect(row.title).toBe('Severity: CRITICAL');
  });

  it('TODO 3–4: CRITICAL hosts pulse, and the class follows input changes', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelectorAll('tr.alert-row.pulse').length).toBe(3);
    const badge = el.querySelector('.badge-demo')!;
    expect(badge.classList).not.toContain('pulse');
    (el.querySelector('button.cycle') as HTMLElement).click();
    await f.whenStable();
    expect(badge.classList).toContain('pulse');
    (el.querySelector('button.cycle') as HTMLElement).click();
    await f.whenStable();
    expect(badge.classList).not.toContain('pulse');
  });
});
