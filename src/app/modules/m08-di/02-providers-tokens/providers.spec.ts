import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { AEGIS_CONFIG, AUDIT_LOGGER, ConsoleLogger, FEATURE_FLAGS, Logger } from './tokens';

describe('M08.02 · providers & tokens', () => {
  const create = async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    return { f, inj: f.debugElement.injector };
  };

  it('TODO 1: config via useValue, frozen', async () => {
    const { inj } = await create();
    const cfg = inj.get(AEGIS_CONFIG);
    expect(cfg).toEqual({ apiBase: '/api/v1', threshold: 90, env: 'prod' });
    expect(Object.isFrozen(cfg)).toBe(true);
  });

  it('TODO 2: flags via useFactory from the config', async () => {
    const { inj } = await create();
    expect(inj.get(FEATURE_FLAGS)).toEqual({ liveStream: true, bulkImport: false });
  });

  it('TODO 3–4: Logger → ConsoleLogger and AUDIT_LOGGER is the same instance', async () => {
    const { f, inj } = await create();
    expect(inj.get(Logger)).toBeInstanceOf(ConsoleLogger);
    expect(inj.get(AUDIT_LOGGER)).toBe(inj.get(Logger));
    (f.nativeElement.querySelector('button.log') as HTMLElement).click();
    await f.whenStable();
    expect(f.nativeElement.querySelector('.lines li')?.textContent).toBe('[console] analyst opened settings');
  });
});
