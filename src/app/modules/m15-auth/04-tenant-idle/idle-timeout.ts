import { DestroyRef, Injectable, InjectionToken, inject, signal } from '@angular/core';
import { Session } from '../shared/session';

export const IDLE_CONFIG = new InjectionToken<{ timeoutMs: number; warnMs: number }>('IDLE_CONFIG', {
  factory: () => ({ timeoutMs: 15 * 60_000, warnMs: 60_000 }),
});

/**
 * Shared SOC workstations: an unattended console must sign itself out.
 * Done for you: start()/stop() run check() every second.
 * TODO 3: check():
 *    idle = now - lastActivity;  left = timeoutMs - idle
 *    left <= 0        → stop(), session.clear(), secondsLeft = null, expired = true
 *    left <= warnMs   → secondsLeft = Math.ceil(left / 1000)       (the "you'll be signed out in 42 s" banner)
 *    otherwise        → secondsLeft = null
 * TODO 4: activity(): record now as lastActivity and hide the warning. Ignore activity once expired.
 */
@Injectable({ providedIn: 'root' })
export class IdleTimeout {
  private readonly session = inject(Session);
  private readonly config = inject(IDLE_CONFIG);
  readonly secondsLeft = signal<number | null>(null);
  readonly expired = signal(false);
  private lastActivity = Date.now();
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  start() {
    this.stop();
    this.expired.set(false);
    this.lastActivity = Date.now();
    this.timer = setInterval(() => this.check(), 1000);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  check() {
  }

  activity() {
  }
}
