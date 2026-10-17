import { Component, signal } from '@angular/core';
import { SeverityHighlight } from './severity-highlight';
import { ALERTS } from '../../../shared/domain/sample-data';
import { Severity } from '../../../shared/domain/models';

@Component({
  selector: 'app-m06-01',
  imports: [SeverityHighlight],
  template: `
    <h1>Severity highlight</h1>
    <table class="card">
      <tbody>
        @for (a of alerts; track a.id) {
          <tr class="alert-row" [aegisSeverity]="a.severity"><td>{{ a.title }}</td></tr>
        }
      </tbody>
    </table>
    <p class="row">
      <span class="badge-demo" [aegisSeverity]="demo()">demo badge: {{ demo() }}</span>
      <button class="cycle" (click)="cycle()">Change severity</button>
    </p>
  `,
  styles: `
    table.card { padding: 0; } td { padding: 10px 14px; }
    .badge-demo { padding: 6px 12px; background: var(--surface); border-radius: 6px; }
    :host ::ng-deep .pulse { animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 50% { background: rgba(239, 68, 68, .12); } }
  `,
})
export class Page {
  protected readonly alerts = ALERTS;
  private readonly order: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  readonly demo = signal<Severity>('HIGH');
  cycle() {
    this.demo.update(s => this.order[(this.order.indexOf(s) + 1) % this.order.length]);
  }
}
