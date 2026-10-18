import { TestBed } from '@angular/core/testing';
import { WIDGETS, resolveLayout } from './registry';
import { UnknownWidget } from './widgets/unknown-widget';
import { MANAGER_LAYOUT, Page } from './page';

async function settle(f: { whenStable(): Promise<unknown> }, el: HTMLElement, sel: string) {
  for (let i = 0; i < 20 && !el.querySelector(sel); i++) { await new Promise(r => setTimeout(r, 10)); await f.whenStable(); }
}

describe('M17.02 · widget registry', () => {
  it('TODO 1: three lazy loaders', async () => {
    expect(Object.keys(WIDGETS).sort()).toEqual(['blocks-chart', 'stat', 'top-iocs']);
    const stat = await WIDGETS['stat']();
    expect(stat.name).toContain('StatWidget');
  });

  it('TODO 2: resolveLayout keeps order and falls back for unknown types', async () => {
    const r = await resolveLayout([{ type: 'top-iocs', inputs: { limit: 2 } }, { type: 'nope' }, { type: 'stat', inputs: { label: 'x', value: 1 } }]);
    expect(r[0].component).toBe(await WIDGETS['top-iocs']());
    expect(r[0].inputs).toEqual({ limit: 2 });
    expect(r[1]).toEqual({ component: UnknownWidget, inputs: { type: 'nope' } });
    expect(r[2].inputs).toEqual({ label: 'x', value: 1 });
  });

  it('TODO 3: the page renders the widgets with their inputs, and swaps layouts', async () => {
    const f = TestBed.createComponent(Page);
    f.autoDetectChanges();
    const el: HTMLElement = f.nativeElement;
    await settle(f, el, '.top-iocs');
    expect([...el.querySelectorAll('.stat .value')].map(e => e.textContent)).toEqual(['1,204', '7']);
    expect(el.querySelectorAll('.top-iocs li').length).toBe(3);
    expect(el.querySelector('.blocks-chart')).toBeTruthy();
    f.componentInstance.layout.set(MANAGER_LAYOUT);
    await settle(f, el, '.unknown');
    expect(el.querySelectorAll('.top-iocs li').length).toBe(5);
    expect(el.querySelector('.unknown')?.textContent).toContain('world-map');
  });
});
