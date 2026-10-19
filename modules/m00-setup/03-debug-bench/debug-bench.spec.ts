import { TestBed } from '@angular/core/testing';
import { Page } from './page';

async function render() {
  const f = TestBed.createComponent(Page);
  await f.whenStable();
  const el: HTMLElement = f.nativeElement;
  const levels = () => [...el.querySelectorAll('.level')].map(e => e.textContent?.trim());
  return { f, el, levels };
}

describe('M00.03 · debugging bench', () => {
  it('bug 1: each gauge shows the right level (Globex at 82 is HIGH)', async () => {
    const { levels } = await render();
    expect(levels()).toEqual(['LOW', 'MEDIUM', 'HIGH']);
  });

  it('bug 2: "Rescan +10" updates the score AND the average', async () => {
    const { f, el, levels } = await render();
    expect(el.querySelector('.avg')?.textContent).toBe('57');
    el.querySelector<HTMLButtonElement>('.rescan')!.click();
    await f.whenStable();
    expect(el.querySelector('.score')?.textContent?.trim()).toBe('45');
    expect(levels()[0]).toBe('MEDIUM');
    expect(el.querySelector('.count')?.textContent).toBe('1');
    expect(el.querySelector('.avg')?.textContent, 'the average is a computed(): did the signal really change?').toBe('61');
  });
});
