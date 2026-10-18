import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { Page } from './page';
import { ALERTS } from '../../../shared/domain/sample-data';

async function setup(behavior = DeferBlockBehavior.Manual) {
  TestBed.configureTestingModule({ deferBlockBehavior: behavior });
  const f = TestBed.createComponent(Page);
  f.autoDetectChanges();
  await f.whenStable();
  return { f, el: f.nativeElement as HTMLElement };
}

describe('M16.02 · @defer when, in lists, on timer', () => {
  it('TODO 1–3: one block for the filters, one per alert, one for the feeds', async () => {
    const { f } = await setup();
    expect((await f.getDeferBlocks()).length).toBe(1 + ALERTS.length + 1);
  });

  it('TODO 1: `when` loads the filters once the signal turns true', async () => {
    const { f, el } = await setup(DeferBlockBehavior.Playthrough);
    expect(el.querySelector('.advanced-filters')).toBeNull();
    f.componentInstance.showAdvanced.set(true);
    for (let i = 0; i < 5 && !el.querySelector('.advanced-filters'); i++) { await new Promise(r => setTimeout(r, 10)); await f.whenStable(); }
    expect(el.querySelector('.advanced-filters')).toBeTruthy();
  });

  it('TODO 2: each row defers its own details', async () => {
    const { f, el } = await setup();
    expect(el.querySelector('.alert-details')).toBeNull();
    const blocks = await f.getDeferBlocks();
    await blocks[2].render(DeferBlockState.Complete);
    const details = el.querySelectorAll('.alert-details');
    expect(details.length).toBe(1);
    expect(el.querySelectorAll('.alert-row')[1].querySelector('.alert-details')?.textContent).toContain(`Event #${ALERTS[1].eventId}`);
  });

  it('TODO 3: the feeds banner starts as a placeholder', async () => {
    const { f, el } = await setup();
    expect(el.querySelector('.feeds-placeholder')).toBeTruthy();
    const blocks = await f.getDeferBlocks();
    await blocks.at(-1)!.render(DeferBlockState.Complete);
    expect(el.querySelector('.related-feeds')).toBeTruthy();
  });
});
