import { Component } from '@angular/core';
import { ALERTS } from '../../../shared/domain/sample-data';
import { AlertSummary, assignedLabel, statusLabel } from './alert-summary';

@Component({
  selector: 'app-m18-01',
  imports: [AlertSummary],
  template: `
    <h1>Translatable console <small class="muted">i18n, ICU, $localize</small></h1>
    <aegis-alert-summary class="card" [alerts]="alerts" analyst="Ana" />
    <ul class="card">
      @for (a of alerts; track a.id) {
        <li class="row"><span class="badge">{{ status(a.status) }}</span> {{ a.title }}
          @if (a.assignee) { <small class="muted">{{ assigned(a.assignee) }}</small> }</li>
      }
    </ul>
    <p class="muted">The app is built in English. See the README for extracting messages and building the French version.</p>
  `,
})
export class Page {
  protected readonly alerts = ALERTS;
  protected readonly status = statusLabel;
  protected readonly assigned = assignedLabel;
}
