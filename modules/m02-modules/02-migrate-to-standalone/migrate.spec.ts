import { TestBed } from '@angular/core/testing';
import { ReportCardComponent } from './report-card.component';
import { ReportsListComponent } from './reports-list.component';
import { Page } from './page';

const deps = (cls: unknown) => { const d = (cls as any).ɵcmp.dependencies; return (typeof d === 'function' ? d() : d) ?? []; };

describe('M02.02 · migrate to standalone', () => {
  it('TODO 1: ReportCardComponent is standalone', () => {
    expect((ReportCardComponent as any).ɵcmp.standalone).toBe(true);
  });

  it('TODO 2: ReportsListComponent is standalone and imports the card', () => {
    expect((ReportsListComponent as any).ɵcmp.standalone).toBe(true);
    expect(deps(ReportsListComponent)).toContain(ReportCardComponent);
  });

  it('TODO 3 + 4: the page imports the component directly, no module left', () => {
    const d = deps(Page);
    expect(d).toContain(ReportsListComponent);
    expect(d.some((x: any) => x?.ɵmod), 'the page should not import any NgModule any more').toBe(false);
  });

  it('behaviour is unchanged after the migration', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const cards = f.nativeElement.querySelectorAll('aegis-report-card');
    expect(cards.length).toBe(3);
    expect(cards[0].querySelector('.big').textContent).toBe('8,423');
    expect(cards[1].querySelector('.change').textContent).toContain('▼ -4.3%');
    expect(cards[2].querySelector('.change').textContent).toContain('no trend yet');
  });
});
