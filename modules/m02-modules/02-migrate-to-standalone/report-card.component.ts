import { Component, Input } from '@angular/core';
//@@sol
import { DecimalPipe, NgIf } from '@angular/common';
//@@end
import { Report } from './reports';

@Component({
  selector: 'aegis-report-card',
//@@sol
  imports: [NgIf, DecimalPipe],
//@@stub
  // TODO 1: make this standalone: delete `standalone: false` and import what the template uses
  //         (*ngIf → NgIf, | number → DecimalPipe, both from '@angular/common')
  standalone: false,
//@@end
  template: `
    <article class="card report">
      <h4>{{ report.title }}</h4>
      <p class="big">{{ report.blocked | number: '1.0-0' }}</p>
      <p class="change" *ngIf="report.change !== null; else noTrend" [class.up]="report.change > 0">
        {{ report.change > 0 ? '▲' : '▼' }} {{ report.change | number: '1.1-1' }}%
      </p>
      <ng-template #noTrend><p class="change muted">no trend yet</p></ng-template>
    </article>
  `,
  styles: `.big { font-size: 28px; font-weight: 700; margin: 6px 0; } h4 { margin: 0; color: var(--muted); font-weight: 500; } .change { margin: 0; color: var(--allow); } .change.up { color: var(--block); }`,
})
export class ReportCardComponent {
  @Input({ required: true }) report!: Report;
}
