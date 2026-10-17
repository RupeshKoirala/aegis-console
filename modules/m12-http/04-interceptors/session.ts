import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantContext {
  /** Set when an MSP admin acts for a child tenant. */
  readonly actingFor = signal<number | null>(null);
}

@Injectable({ providedIn: 'root' })
export class SessionEvents {
  readonly expired = signal(false);
}

/** Collects TimingInterceptor lines (so tests and the page can read them). */
@Injectable({ providedIn: 'root' })
export class RequestLog {
  readonly lines = signal<string[]>([]);
  add(line: string) {
    this.lines.update(l => [line, ...l].slice(0, 20));
  }
}
