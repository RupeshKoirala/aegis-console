import { Component, ComponentRef, DestroyRef, ViewContainerRef, WritableSignal, inject, signal, viewChild } from '@angular/core';
import { inputBinding, outputBinding } from '@angular/core';
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

  show(severity: Severity, message: string): ComponentRef<AlertToast> {
    if (this.refs.length >= MAX_TOASTS) this.close(this.refs[0]);
    const sev = signal(severity);
    const ref: ComponentRef<AlertToast> = this.slot().createComponent(AlertToast, {
      bindings: [
        inputBinding('severity', sev),
        inputBinding('message', () => message),
        outputBinding('dismiss', () => this.close(ref)),
      ],
    });
    this.severities.set(ref, sev);
    this.timers.set(ref, setTimeout(() => this.close(ref), AUTO_DISMISS_MS));
    this.refs.push(ref);
    this.count.set(this.refs.length);
    return ref;
  }

  escalateNewest() {
    const newest = this.refs.at(-1);
    if (newest) this.severities.get(newest)?.set('CRITICAL');
  }

  clear() {
    [...this.refs].forEach(r => this.close(r));
  }

  private close(ref: ComponentRef<AlertToast>) {
    const i = this.refs.indexOf(ref);
    if (i < 0) return;
    clearTimeout(this.timers.get(ref));
    this.timers.delete(ref);
    this.severities.delete(ref);
    this.refs.splice(i, 1);
    ref.destroy();
    this.count.set(this.refs.length);
  }
}
