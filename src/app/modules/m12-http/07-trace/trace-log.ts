import { Injectable, signal } from '@angular/core';

/** Done for you: a timestamped log. Interceptors and the page write to it; the page draws it as a timeline. */
@Injectable({ providedIn: 'root' })
export class TraceLog {
  private t0 = performance.now();
  readonly entries = signal<{ ms: number; label: string }[]>([]);

  start() {
    this.t0 = performance.now();
    this.entries.set([]);
  }
  add(label: string) {
    this.entries.update(e => [...e, { ms: Math.round(performance.now() - this.t0), label }]);
  }
  labels(): string[] {
    return this.entries().map(e => e.label);
  }
}
