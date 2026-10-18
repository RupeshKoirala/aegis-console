import { Component, signal } from '@angular/core';
import { ALERTS } from '../../../shared/domain/sample-data';
import { AlertQueue } from './alert-queue';

@Component({
  selector: 'app-m26-03',
  imports: [AlertQueue],
  template: `
    <h1>Accessible alert queue <small class="muted">keyboard, screen readers, focus</small></h1>
    <p class="muted">Click the list once, then put the mouse away: ↑ ↓ Home End, Enter, Tab, Escape. Try it with a screen reader (VoiceOver: Cmd+F5, NVDA on Windows).</p>
    <aegis-alert-queue [alerts]="alerts()" (resolve)="resolve($event.id)" />
  `,
})
export class Page {
  readonly alerts = signal(ALERTS.filter(a => a.status !== 'RESOLVED'));
  resolve(id: number) {
    this.alerts.update(l => l.filter(a => a.id !== id));
  }
}
