import { TestBed } from '@angular/core/testing';
import { AlertPanel } from './alert-panel';
import { AlertStore } from './alert-store';

describe('M11.05 · interop', () => {
  it('TODO 1: visible follows the status signal', async () => {
    const f = TestBed.createComponent(AlertPanel);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('.alert').length).toBe(6);
    f.componentInstance.status.set('NEW');
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('.alert').length).toBe(3);
  });

  it('TODO 2: counts alerts resolved after the panel opened', async () => {
    const f = TestBed.createComponent(AlertPanel);
    await f.whenStable();
    TestBed.inject(AlertStore).resolve(1);
    TestBed.inject(AlertStore).resolve(3);
    await f.whenStable();
    expect(f.nativeElement.querySelector('.resolved-count').textContent).toContain('2');
  });

  it('TODO 3: no subscriptions survive destroy', async () => {
    const store = TestBed.inject(AlertStore);
    const before = store.observers();
    const f = TestBed.createComponent(AlertPanel);
    await f.whenStable();
    expect(store.observers()).toBeGreaterThan(before + 1);
    f.destroy();
    expect(store.observers()).toBe(before);
  });
});
