import { TestBed } from '@angular/core/testing';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AlertQueue } from './alert-queue';
import { ALERTS } from '../../../shared/domain/sample-data';

const OPEN = ALERTS.filter(a => a.status !== 'RESOLVED');

async function setup() {
  const announce = vi.fn(async () => {});
  TestBed.configureTestingModule({ providers: [{ provide: LiveAnnouncer, useValue: { announce } }] });
  const f = TestBed.createComponent(AlertQueue);
  f.componentRef.setInput('alerts', OPEN);
  f.autoDetectChanges();
  await f.whenStable();
  const el: HTMLElement = f.nativeElement;
  const list = el.querySelector('[role=listbox]') as HTMLElement;
  // The CDK key manager still reads the legacy keyCode, so synthetic events must carry it.
  const CODES: Record<string, number> = { ArrowDown: 40, ArrowUp: 38, Home: 36, End: 35, Enter: 13, Escape: 27 };
  const key = async (k: string) => { list.dispatchEvent(new KeyboardEvent('keydown', { key: k, keyCode: CODES[k], bubbles: true })); await f.whenStable(); };
  return { f, el, list, key, announce };
}

describe('M26.03 · accessibility', () => {
  it('TODO 1: arrows/Home/End move aria-activedescendant', async () => {
    const { list, key } = await setup();
    expect(list.getAttribute('aria-activedescendant')).toBe(`alert-opt-${OPEN[0].id}`);
    await key('ArrowDown'); await key('ArrowDown');
    expect(list.getAttribute('aria-activedescendant')).toBe(`alert-opt-${OPEN[2].id}`);
    await key('End');
    expect(list.getAttribute('aria-activedescendant')).toBe(`alert-opt-${OPEN.at(-1)!.id}`);
    await key('ArrowDown');
    expect(list.getAttribute('aria-activedescendant')).toBe(`alert-opt-${OPEN[0].id}`);
    expect(document.getElementById(`alert-opt-${OPEN[0].id}`)?.getAttribute('aria-selected')).toBe('true');
  });

  it('TODO 2 + 4: Enter opens a real modal dialog; Escape closes it and focus returns', async () => {
    const { el, list, key, f } = await setup();
    await key('ArrowDown');
    await key('Enter');
    const dialog = el.querySelector('.dialog') as HTMLElement;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('confirm-title');
    expect(dialog.textContent).toContain(OPEN[1].title);
    expect(dialog.hasAttribute('cdktrapfocus')).toBe(true);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    await f.whenStable();
    expect(el.querySelector('.dialog')).toBeNull();
    expect(document.activeElement).toBe(list);
  });

  it('TODO 3: resolving announces it and emits', async () => {
    const { el, key, f, announce } = await setup();
    const resolved: number[] = [];
    f.componentInstance.resolve.subscribe(a => resolved.push(a.id));
    await key('Enter');
    (el.querySelector('button.yes') as HTMLButtonElement).click();
    await f.whenStable();
    expect(resolved).toEqual([OPEN[0].id]);
    expect(announce).toHaveBeenCalledWith(`Alert resolved: ${OPEN[0].title}`, 'polite');
  });
});
