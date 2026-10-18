// Done for you: the presentational table, shared by 01–03. Inputs in, events out: it doesn't know about NgRx.
import { Component, input, output } from '@angular/core';
import { Alert } from '../../../shared/domain/models';
import { AlertStatus, StatusFilter } from './alerts.actions';

@Component({
  selector: 'aegis-triage-view',
  template: `
    <div class="row filters">
      @for (f of filters; track f) {
        <button class="filter" [class.primary]="filter() === f" (click)="filterChange.emit(f)">{{ f }}
          @if (f !== 'ALL') { <span class="tag">{{ counts()[f] }}</span> }</button>
      }
    </div>
    @if (loading()) { <p class="muted">Loading…</p> }
    @if (error(); as e) { <p class="error-text triage-error">{{ e }}</p> }
    <table class="card">
      @for (a of alerts(); track a.id) {
        <tr class="alert-row"><td><span class="badge">{{ a.severity }}</span></td><td>{{ a.title }}</td><td class="status">{{ a.status }}</td>
          <td>@for (s of next(a.status); track s) { <button class="triage" (click)="triage.emit({ id: a.id, status: s, previous: a.status })">→ {{ s }}</button> }</td></tr>
      }
    </table>`,
  styles: `table { width: 100%; border-collapse: collapse; margin-top: 8px; } td { padding: 6px; border-bottom: 1px solid var(--border); }`,
})
export class TriageView {
  readonly alerts = input.required<Alert[]>();
  readonly filter = input.required<StatusFilter>();
  readonly counts = input.required<Record<AlertStatus, number>>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly filterChange = output<StatusFilter>();
  readonly triage = output<{ id: number; status: AlertStatus; previous: AlertStatus }>();
  protected readonly filters: StatusFilter[] = ['ALL', 'NEW', 'TRIAGED', 'RESOLVED'];
  protected next(s: AlertStatus): AlertStatus[] {
    return s === 'NEW' ? ['TRIAGED', 'RESOLVED'] : s === 'TRIAGED' ? ['RESOLVED', 'NEW'] : ['NEW'];
  }
}
