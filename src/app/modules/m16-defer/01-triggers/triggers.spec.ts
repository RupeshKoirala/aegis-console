import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { Page } from './page';

async function setup() {
  TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual });
  const f = TestBed.createComponent(Page);
  await f.whenStable();
  f.autoDetectChanges();
  return { f, el: f.nativeElement as HTMLElement, blocks: await f.getDeferBlocks() };
}

describe('M16.01 · @defer triggers', () => {
  it('three defer blocks, each starting as its placeholder', async () => {
    const { el, blocks } = await setup();
    expect(blocks.length).toBe(3);
    expect(el.querySelector('.ioc-placeholder')).toBeTruthy();
    expect(el.querySelector('.map-placeholder')).toBeTruthy();
    expect(el.querySelector('.chart-placeholder')).toBeTruthy();
    expect(el.querySelector('aegis-ioc-table, aegis-threat-map, aegis-attack-chart')).toBeNull();
  });

  it('TODO 1: the IOC table renders when its block completes', async () => {
    const { el, blocks } = await setup();
    await blocks[0].render(DeferBlockState.Complete);
    expect(el.querySelector('.ioc-table')).toBeTruthy();
    expect(el.querySelector('.ioc-placeholder')).toBeNull();
  });

  it('TODO 2: the map has a loading state', async () => {
    const { f, el, blocks } = await setup();
    await blocks[1].render(DeferBlockState.Loading);
    await new Promise(r => setTimeout(r, 150)); // "after 100ms": the loading block waits before showing
    await f.whenStable();
    expect(el.querySelector('.map-loading')?.textContent).toContain('Loading map');
  });

  it('TODO 2: the map has an error state', async () => {
    const { f, el, blocks } = await setup();
    await blocks[1].render(DeferBlockState.Error);
    await new Promise(r => setTimeout(r, 350)); // the placeholder's "minimum 300ms"
    await f.whenStable();
    expect(el.querySelector('.map-error')).toBeTruthy();
  });

  it('TODO 2: the map renders when complete', async () => {
    const { el, blocks } = await setup();
    await blocks[1].render(DeferBlockState.Complete);
    expect(el.querySelector('.map svg')).toBeTruthy();
  });

  it('TODO 3: the chart appears after completing its block', async () => {
    const { el, blocks } = await setup();
    await blocks[2].render(DeferBlockState.Complete);
    expect(el.querySelector('.attack-chart')).toBeTruthy();
  });
});
