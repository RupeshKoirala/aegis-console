import { TestBed } from '@angular/core/testing';
import { Page } from './page';

describe('M08.03 · resolution modifiers', () => {
  it('TODO 1–3: nodes find their parent via skipSelf + optional', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const nodes = Array.from(f.nativeElement.querySelectorAll('.node')) as HTMLElement[];
    const depths = nodes.map(n => n.querySelector('.depth')?.textContent);
    expect(depths).toEqual(['d0', 'd1', 'd2', 'd2', 'd1']);
    expect(nodes[2].querySelector('.path')?.textContent).toBe('Shieldline MSP / Acme Schools / Main campus');
  });

  it('TODO 4: self vs skipSelf', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('.top .probe')?.textContent).toBe('own: none · inherited: none');
    expect(el.querySelector('.child .probe')?.textContent).toBe('own: none · inherited: dark');
  });
});
