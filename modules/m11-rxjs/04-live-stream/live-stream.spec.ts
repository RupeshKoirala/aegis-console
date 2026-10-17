import { TestBed } from '@angular/core/testing';
import { EVENT_SOURCE, LiveEvents } from './live-events.service';
import { Page } from './page';

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  closed = false;
  onerror: (() => void) | null = null;
  private listeners: ((e: MessageEvent) => void)[] = [];
  constructor(public url: string) { FakeEventSource.instances.push(this); }
  addEventListener(type: string, fn: (e: MessageEvent) => void) { if (type === 'traffic') this.listeners.push(fn); }
  close() { this.closed = true; }
  emit(data: object) { this.listeners.forEach(l => l({ data: JSON.stringify(data) } as MessageEvent)); }
}

const ev = (id: number, action: 'ALLOW' | 'BLOCK' = 'BLOCK') =>
  ({ id, tenantId: 1, at: '2026-10-15T12:00:00Z', source: '10.1.1.1', destination: '203.0.113.66', indicatorId: 7, action, severity: 'CRITICAL', enforcementPoint: 'fw' });

describe('M11.04 · live stream', () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
    TestBed.configureTestingModule({ providers: [{ provide: EVENT_SOURCE, useValue: (url: string) => new FakeEventSource(url) as unknown as EventSource }] });
  });
  afterEach(() => vi.useRealTimers());

  it('TODO 1: one shared connection, closed on teardown', () => {
    const live = TestBed.inject(LiveEvents);
    const a = live.events$.subscribe();
    const b = live.events$.subscribe();
    expect(FakeEventSource.instances.length, 'share() should give one connection').toBe(1);
    expect(FakeEventSource.instances[0].url).toContain('/api/v1/events/stream');
    a.unsubscribe(); b.unsubscribe();
    expect(FakeEventSource.instances[0].closed).toBe(true);
  });

  it('TODO 2 + 4: recent (max 20, newest first) and blocked count', () => {
    const live = TestBed.inject(LiveEvents);
    let recent: any[] = []; let blocked = 0;
    live.recent$.subscribe(r => (recent = r));
    live.blocked$.subscribe(b => (blocked = b));
    const src = FakeEventSource.instances[0];
    for (let i = 1; i <= 25; i++) src.emit(ev(i, i % 5 === 0 ? 'ALLOW' : 'BLOCK'));
    expect(recent.length).toBe(20);
    expect(recent[0].id).toBe(25);
    expect(blocked).toBe(20);
  });

  it('TODO 3: perSecond counts per 1 s window', () => {
    vi.useFakeTimers();
    const live = TestBed.inject(LiveEvents);
    const rates: number[] = [];
    live.perSecond$.subscribe(r => rates.push(r));
    const src = FakeEventSource.instances[0];
    src.emit(ev(1)); src.emit(ev(2)); src.emit(ev(3));
    vi.advanceTimersByTime(1000);
    src.emit(ev(4));
    vi.advanceTimersByTime(1000);
    expect(rates).toEqual([3, 1]);
  });

  it('the page renders events and closes the stream on destroy', async () => {
    const f = TestBed.createComponent(Page);
    await f.whenStable();
    FakeEventSource.instances[0].emit(ev(1));
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('tr.event').length).toBe(1);
    f.destroy();
    expect(FakeEventSource.instances.every(s => s.closed)).toBe(true);
  });
});
