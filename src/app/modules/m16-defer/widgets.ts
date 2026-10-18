// Done for you: "heavy" dashboard widgets. Imagine each pulls in a big library (maps, charts, a data grid).
// Because they're used ONLY inside @defer blocks, the bundler moves each one into its own lazy chunk.
import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ALERTS, INDICATORS } from '../../shared/domain/sample-data';
import { Alert } from '../../shared/domain/models';

@Component({
  selector: 'aegis-threat-map',
  template: `
    <div class="card map"><h3>Threat map</h3>
      <svg viewBox="0 0 300 120" class="world">
        <rect width="300" height="120" rx="8" fill="var(--surface-2)" />
        @for (p of points; track $index) { <circle [attr.cx]="p[0]" [attr.cy]="p[1]" r="4" fill="var(--danger, #e5484d)" /> }
      </svg>
    </div>`,
  styles: `.world { width: 100%; max-width: 480px; }`,
})
export class ThreatMap {
  protected readonly points = [[60, 40], [150, 70], [220, 30], [250, 90], [110, 95]];
}

@Component({
  selector: 'aegis-ioc-table',
  template: `
    <div class="card ioc-table"><h3>Top indicators</h3>
      <table>@for (i of rows; track i.id) { <tr><td class="mono">{{ i.value }}</td><td>{{ i.category }}</td><td>{{ i.score }}</td></tr> }</table>
    </div>`,
})
export class IocTable {
  protected readonly rows = INDICATORS.filter(i => i.score).sort((a, b) => b.score! - a.score!).slice(0, 6);
}

@Component({
  selector: 'aegis-attack-chart',
  template: `
    <div class="card attack-chart"><h3>Blocks per hour</h3>
      <div class="bars">@for (v of values; track $index) { <div class="bar" [style.height.px]="v"></div> }</div>
    </div>`,
  styles: `.bars { display: flex; gap: 4px; align-items: flex-end; height: 90px; } .bar { width: 14px; background: var(--accent); border-radius: 3px 3px 0 0; }`,
})
export class AttackChart {
  protected readonly values = [20, 35, 28, 60, 82, 44, 30, 70, 90, 55, 40, 25];
}

@Component({
  selector: 'aegis-alert-details',
  imports: [DatePipe],
  template: `
    <div class="alert-details">
      <p>Event #{{ alert().eventId }} · {{ alert().at | date: 'medium' }} · assignee {{ alert().assignee ?? 'nobody' }}</p>
      <p class="muted">Raw packet capture, enrichment and related indicators would load here.</p>
    </div>`,
})
export class AlertDetails {
  readonly alert = input.required<Alert>();
}

@Component({
  selector: 'aegis-related-feeds',
  template: `<p class="card related-feeds">📡 3 partner feeds mention indicators from today's incidents.</p>`,
})
export class RelatedFeeds {}

@Component({
  selector: 'aegis-advanced-filters',
  template: `<div class="card advanced-filters">Advanced filters: CIDR range · ASN · enforcement point · time window</div>`,
})
export class AdvancedFilters {}

export const SAMPLE_ALERTS = ALERTS;
