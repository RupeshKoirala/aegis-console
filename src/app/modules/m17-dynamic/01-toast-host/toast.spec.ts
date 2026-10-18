import { TestBed } from '@angular/core/testing';
import { AUTO_DISMISS_MS, MAX_TOASTS, Page } from './page';

async function setup() {
  const f = TestBed.createComponent(Page);
  f.autoDetectChanges();
  await f.whenStable();
  const el: HTMLElement = f.nativeElement;
  return { f, el, page: f.componentInstance, toasts: () => [...el.querySelectorAll('aegis-alert-toast')] as HTMLElement[] };
}

describe('M17.01 · toast host', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1: show() creates a toast with its inputs', async () => {
    const { f, page, toasts } = await setup();
    page.show('HIGH', 'Repeated hits');
    await f.whenStable();
    expect(toasts().length).toBe(1);
    expect(toasts()[0].querySelector('.msg')?.textContent).toBe('Repeated hits');
    expect(toasts()[0].dataset['severity']).toBe('HIGH');
    expect(page.count()).toBe(1);
  });

  it('TODO 1: never more than MAX_TOASTS, oldest goes first', async () => {
    const { f, page, toasts } = await setup();
    for (let i = 1; i <= MAX_TOASTS + 1; i++) page.show('INFO', `t${i}`);
    await f.whenStable();
    expect(toasts().map(t => t.querySelector('.msg')?.textContent)).toEqual(['t2', 't3', 't4']);
  });

  it('TODO 1 + 3: the output closes it; so does the timer', async () => {
    const { f, page, toasts } = await setup();
    vi.useFakeTimers();
    page.show('INFO', 'a');
    page.show('INFO', 'b');
    f.detectChanges();
    (toasts()[0].querySelector('button.close') as HTMLButtonElement).click();
    f.detectChanges();
    expect(toasts().map(t => t.querySelector('.msg')?.textContent)).toEqual(['b']);
    vi.advanceTimersByTime(AUTO_DISMISS_MS);
    f.detectChanges();
    expect(toasts().length).toBe(0);
    expect(page.count()).toBe(0);
  });

  it('TODO 2: setInput changes a live component', async () => {
    const { f, page, toasts } = await setup();
    page.show('INFO', 'a');
    page.show('HIGH', 'b');
    page.escalateNewest();
    await f.whenStable();
    expect(toasts().map(t => t.dataset['severity'])).toEqual(['INFO', 'CRITICAL']);
  });

  it('TODO 3: clear() removes everything', async () => {
    const { f, page, toasts } = await setup();
    page.show('INFO', 'a'); page.show('INFO', 'b');
    page.clear();
    await f.whenStable();
    expect(toasts().length).toBe(0);
    expect(page.count()).toBe(0);
  });
});
