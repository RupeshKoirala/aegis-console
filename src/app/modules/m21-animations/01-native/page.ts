import { Component, signal } from '@angular/core';
import { Severity } from '../../../shared/domain/models';
import { ToastCard } from './toast-card';

interface Toast { id: number; severity: Severity; message: string }
let nextId = 1;

@Component({
  selector: 'app-m21-01',
  imports: [ToastCard],
  template: `
    <h1>Alert toasts <small class="muted">animate.enter / animate.leave</small></h1>
    <div class="row card">
      <button (click)="add('HIGH', 'Repeated hits on 192.0.2.77')">+ High</button>
      <button class="danger" (click)="add('CRITICAL', 'Blocked traffic to 203.0.113.66')">+ Critical</button>
      <button (click)="toasts.set([])">Dismiss all</button>
    </div>
    <p class="muted">Turn on "reduce motion" in your OS settings and try again: the toasts should just appear and disappear.</p>
    <div class="stack">
      @for (t of toasts(); track t.id) {
        <aegis-toast-card [severity]="t.severity" [message]="t.message" (dismiss)="remove(t.id)" />
      }
    </div>
  `,
  styles: `.stack { display: grid; gap: 8px; max-width: 520px; margin-top: 12px; }`,
})
export class Page {
  readonly toasts = signal<Toast[]>([]);
  add(severity: Severity, message: string) {
    this.toasts.update(l => [{ id: nextId++, severity, message }, ...l]);
  }
  remove(id: number) {
    this.toasts.update(l => l.filter(t => t.id !== id));
  }
}
