import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { SortByImpurePipe } from './impure-sort.pipe';
import { calls } from './call-counter';

describe('M07.03 · pure vs impure', () => {
  beforeEach(() => { calls.pure = 0; calls.impure = 0; });
  const list = (el: HTMLElement, c: string) => Array.from(el.querySelectorAll(`ol.${c} li`)).map(l => l.textContent);

  it('TODO 3: the impure pipe is declared pure: false', () => {
    expect((SortByImpurePipe as any).ɵpipe.pure).toBe(false);
  });

  it('push: the pure pipe stays stale, the impure one updates', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    (el.querySelector('.add-mutable') as HTMLElement).click();
    await f.whenStable();
    expect(list(el, 'pure').length).toBe(2);
    expect(list(el, 'impure').length).toBe(3);
  });

  it('TODO 1: an immutable add updates the pure pipe too', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    (el.querySelector('.add-immutable') as HTMLElement).click();
    await f.whenStable();
    expect(list(el, 'pure')).toEqual(['203.0.113.7', 'aa-new-1.example', 'evil.example']);
  });

  it('TODO 2–3: unrelated clicks re-run only the impure pipe', async () => {
    const f = TestBed.createComponent(Page);
    const el: HTMLElement = f.nativeElement;
    await f.whenStable();
    const before = { ...calls };
    for (let i = 0; i < 3; i++) {
      (el.querySelector('.noop') as HTMLElement).click();
      await f.whenStable();
    }
    expect(calls.pure - before.pure).toBe(0);
    expect(calls.impure - before.impure).toBeGreaterThanOrEqual(3);
  });
});
