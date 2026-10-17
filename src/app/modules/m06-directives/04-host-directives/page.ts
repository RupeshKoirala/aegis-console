import { Component, signal } from '@angular/core';
import { IndicatorChip } from './indicator-chip';
import { INDICATORS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-m06-04',
  imports: [IndicatorChip],
  template: `
    <h1>Indicator chips</h1>
    <p class="muted">Tab to a chip, then press Enter.</p>
    <div class="card">
      @for (i of indicators; track i.id) {
        <aegis-indicator-chip [value]="i.value" [tip]="i.category + ' · score ' + i.score" (activated)="opened.set(i.value)" />
      }
    </div>
    <p class="opened">Opened: {{ opened() ?? '—' }}</p>
  `,
})
export class Page {
  protected readonly indicators = INDICATORS.filter(i => i.score !== null).slice(0, 6);
  readonly opened = signal<string | null>(null);
}
