import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { ProjectionRow } from './projection';

@Component({
  selector: 'aegis-legacy-results-table',
  imports: [DecimalPipe, PercentPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (rows.length) {
      <table class="card results">
        <thead><tr><th>Month</th><th>Added</th><th>Expired</th><th>Total entries</th><th>Capacity used</th></tr></thead>
        <tbody>
          @for (r of rows; track r.month) {
            <tr class="result-row" [class.warn]="r.utilization >= 0.8" [class.full]="r.utilization >= 1">
              <td>{{ r.month }}</td><td>{{ r.added | number }}</td><td>{{ r.expired | number }}</td>
              <td>{{ r.total | number }}</td><td class="util">{{ r.utilization | percent: '1.0-1' }}</td>
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <p class="empty muted">Enter your numbers and press <strong>Project</strong>.</p>
    }
  `,
  styleUrl: '../01-planner-signals/results-table.css',
})
export class LegacyResultsTable {
  @Input() rows: ProjectionRow[] = [];
}
