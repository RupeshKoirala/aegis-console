import { Component, signal } from '@angular/core';
//@@sol
import { SeverityHighlight } from './severity-highlight';
//@@end
import { ALERTS } from '../../../shared/domain/sample-data';
import { Severity } from '../../../shared/domain/models';

@Component({
  selector: 'app-m06-01',
//@@sol
  imports: [SeverityHighlight],
//@@stub
  imports: [], // TODO 5a: import SeverityHighlight once TODO 1 makes it a directive
//@@end
  template: `
    <h1>Severity highlight</h1>
    <table class="card">
      <tbody>
        @for (a of alerts; track a.id) {
<!--@@sol-->
          <tr class="alert-row" [aegisSeverity]="a.severity"><td>{{ a.title }}</td></tr>
<!--@@stub-->
          <!-- TODO 5b: add [aegisSeverity]="a.severity" to this row -->
          <tr class="alert-row"><td>{{ a.title }}</td></tr>
<!--@@end-->
        }
      </tbody>
    </table>
    <p class="row">
<!--@@sol-->
      <span class="badge-demo" [aegisSeverity]="demo()">demo badge: {{ demo() }}</span>
<!--@@stub-->
      <!-- TODO 5c: and [aegisSeverity]="demo()" here -->
      <span class="badge-demo">demo badge: {{ demo() }}</span>
<!--@@end-->
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
