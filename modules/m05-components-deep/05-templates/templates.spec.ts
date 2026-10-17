import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';

describe('M05.05 · templates', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1 + 4: rows are stamped from the consumer template with $implicit and index', () => {
    const rows = el.querySelectorAll('.t-threats tr.threat-row');
    expect(rows.length).toBe(5);
    expect(rows[0].querySelector('.n')?.textContent?.trim()).toBe('1');
    expect(rows[0].textContent).toContain('203.0.113.66');
    expect(rows[0].querySelector('.sev')?.textContent).toBe('CRITICAL');
    expect(el.querySelectorAll('.t-threats .default-row').length).toBe(0);
  });

  it('TODO 2 + 5: custom empty template', () => {
    expect(el.querySelector('.t-alerts .calm')?.textContent).toContain('No open alerts');
    expect(el.querySelector('.t-alerts .default-empty')).toBeNull();
  });

  it('TODO 1 + 3: defaults when no template is given', async () => {
    expect(el.querySelectorAll('.t-tenants tr.default-row').length).toBe(2);
  });

  it('TODO 2 + 3: default empty template', async () => {
    const t = TestBed.createComponent((await import('./smart-table')).SmartTable);
    t.componentRef.setInput('rows', []);
    await t.whenStable();
    expect(t.nativeElement.querySelector('.default-empty')?.textContent).toContain('No rows');
  });
});
