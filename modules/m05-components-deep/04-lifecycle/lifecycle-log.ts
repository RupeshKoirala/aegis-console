import { Injectable, signal } from '@angular/core';

/**
 * Hooks like ngDoCheck run on EVERY change detection pass. If each run wrote to a signal the page displays,
 * the page would re-render, run the hooks again, write again… forever (NG0103). So "check" hooks use
 * logCheck(), which records each check hook only once per cycle (until the next normal log entry).
 */
@Injectable({ providedIn: 'root' })
export class LifecycleLog {
  private readonly _entries = signal<string[]>([]);
  private readonly checkedThisCycle = new Set<string>();
  readonly entries = this._entries.asReadonly();

  log(entry: string) {
    this.checkedThisCycle.clear();
    this._entries.update(e => [...e, entry]);
  }

  logCheck(hook: string) {
    if (this.checkedThisCycle.has(hook)) return;
    this.checkedThisCycle.add(hook);
    this._entries.update(e => [...e, hook]);
  }

  clear() {
    this.checkedThisCycle.clear();
    this._entries.set([]);
  }
}
