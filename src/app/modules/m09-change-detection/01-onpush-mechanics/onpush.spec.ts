import { TestBed } from '@angular/core/testing';
import { Page } from './page';
import { AlertCard } from './alert-card';
import { ALERTS } from '../../../shared/domain/sample-data';

describe('M09.01 · OnPush mechanics', () => {
  afterEach(() => vi.useRealTimers());

  it('TODO 1: resolving re-renders the OnPush card', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    (f.nativeElement.querySelector('button.resolve') as HTMLElement).click();
    await f.whenStable();
    expect(f.nativeElement.querySelector('.status').textContent).toBe('Status: RESOLVED');
    expect(ALERTS[0].status, 'the shared sample data must not be mutated').toBe('NEW');
  });

  it('TODO 2: the timer-driven counter renders without zone.js', async () => {
    vi.useFakeTimers();
    const f = TestBed.createComponent(AlertCard);
    f.componentRef.setInput('alert', ALERTS[1]);
    f.autoDetectChanges();
    vi.advanceTimersByTime(3000);
    await vi.runOnlyPendingTimersAsync();
    expect(f.nativeElement.querySelector('.seen').textContent).toContain('seen 3 s ago');
  });
});
