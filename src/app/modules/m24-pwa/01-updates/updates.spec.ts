import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { AppUpdates, CHECK_EVERY_MS, RELOAD } from './app-updates';

function setup(isEnabled = true) {
  const versionUpdates = new Subject<VersionEvent>();
  const unrecoverable = new Subject<{ type: 'UNRECOVERABLE_STATE'; reason: string }>();
  const sw = { isEnabled, versionUpdates, unrecoverable, checkForUpdate: vi.fn(async () => true), activateUpdate: vi.fn(async () => true) };
  const reload = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: SwUpdate, useValue: sw }, { provide: RELOAD, useValue: reload }] });
  return { updates: TestBed.inject(AppUpdates), sw, versionUpdates, unrecoverable, reload };
}

describe('M24.01 · app updates', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 2: only VERSION_READY shows the banner', () => {
    const { updates, versionUpdates } = setup();
    versionUpdates.next({ type: 'VERSION_DETECTED', version: { hash: 'b' } });
    expect(updates.ready()).toBeNull();
    versionUpdates.next({ type: 'VERSION_READY', currentVersion: { hash: 'aaa' }, latestVersion: { hash: 'bbb' } });
    expect(updates.ready()).toEqual({ current: 'aaa', latest: 'bbb' });
  });

  it('TODO 3: unrecoverable state', () => {
    const { updates, unrecoverable } = setup();
    unrecoverable.next({ type: 'UNRECOVERABLE_STATE', reason: 'evicted' });
    expect(updates.broken()).toBe(true);
  });

  it('TODO 4: checks for updates periodically', () => {
    vi.useFakeTimers();
    const { sw } = setup();
    vi.advanceTimersByTime(CHECK_EVERY_MS * 2);
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(2);
  });

  it('TODO 1: disabled service worker → nothing subscribes', () => {
    vi.useFakeTimers();
    const { versionUpdates, sw } = setup(false);
    expect(versionUpdates.observed).toBe(false);
    vi.advanceTimersByTime(CHECK_EVERY_MS);
    expect(sw.checkForUpdate).not.toHaveBeenCalled();
  });

  it('TODO 5: activate first, then reload', async () => {
    const { updates, sw, reload } = setup();
    let activatedBeforeReload = false;
    reload.mockImplementation(() => (activatedBeforeReload = sw.activateUpdate.mock.calls.length === 1));
    await updates.applyUpdate();
    expect(reload).toHaveBeenCalledOnce();
    expect(activatedBeforeReload).toBe(true);
  });
});
