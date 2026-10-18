import { Component, ComponentRef, DestroyRef, ViewContainerRef, WritableSignal, inject, signal, viewChild } from '@angular/core';
import { Severity } from '../../../shared/domain/models';
import { AlertToast } from './alert-toast';

export const MAX_TOASTS = 3;
export const AUTO_DISMISS_MS = 8000;

@Component({
  selector: 'app-m17-01',
  template: `
    <h1>Toast host <small class="muted">ViewContainerRef.createComponent</small></h1>
    <div class="row card">
      <button (click)="show('INFO', 'Feed sync finished: 1,204 indicators')">Info</button>
      <button (click)="show('HIGH', 'Repeated hits on 192.0.2.77')">High</button>
      <button class="danger" (click)="show('CRITICAL', 'Blocked traffic to 203.0.113.66 (Botnets)')">Critical</button>
      <button class="escalate" (click)="escalateNewest()">Escalate newest → CRITICAL</button>
      <button (click)="clear()">Clear</button>
      <span class="muted count">{{ count() }} on screen</span>
    </div>
    <!-- Nothing is declared here: toasts are created from code into this anchor. -->
    <div class="stack"><ng-container #slot /></div>
  `,
  styles: `.stack { display: grid; gap: 8px; margin-top: 12px; }`,
})
export class Page {
  /** The anchor: read it as a ViewContainerRef, the API for creating views at that spot. */
  private readonly slot = viewChild.required('slot', { read: ViewContainerRef });
  private readonly refs: ComponentRef<AlertToast>[] = [];
  private readonly timers = new Map<ComponentRef<AlertToast>, ReturnType<typeof setTimeout>>();
  /** each toast's severity as a SIGNAL: the input binding reads it, so setting it updates the live toast */
  private readonly severities = new Map<ComponentRef<AlertToast>, WritableSignal<Severity>>();
  readonly count = signal(0);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(t => clearTimeout(t)));
  }

  /**
   * TODO 1: create an AlertToast in the slot:
   *   const ref = this.slot().createComponent(AlertToast, { bindings: [
   *     inputBinding('severity', sev), inputBinding('message', () => message),     // sev = signal(severity)
   *     outputBinding('dismiss', () => this.close(ref)),
   *   ]});
   * Keep at most MAX_TOASTS: close the OLDEST first. Auto-close after AUTO_DISMISS_MS (setTimeout, kept in this.timers; clear it on close).
   * Track refs in this.refs, keep each toast's `sev` signal in this.severities, keep count() in sync, return the ref.
   */
  show(_severity: Severity, _message: string): ComponentRef<AlertToast> {
    return undefined as unknown as ComponentRef<AlertToast>;
  }

  /**
   * TODO 2: change an input of an ALREADY CREATED toast: set the newest toast's severity signal to 'CRITICAL'.
   * (Because the input is bound to a signal, the toast updates itself. ref.setInput() is the Gen 2 way, for
   *  inputs you did NOT bind with `bindings`.)
   */
  escalateNewest() {}

  /** TODO 3: close(ref): remove from refs/timers/severities, clear its timer, ref.destroy() (removes it from the DOM), update count. clear() closes all. */
  clear() {}
}
