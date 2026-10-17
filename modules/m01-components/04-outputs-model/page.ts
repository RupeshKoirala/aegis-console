import { Component, computed, signal } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { IndicatorView, Severity } from '../../../shared/domain/models';
import { riskLevel } from '../../../shared/domain/risk';
import { IndicatorRow } from './indicator-row';
import { LegacyRow } from './legacy-row';
import { SeverityFilter } from './severity-filter';

@Component({
  selector: 'app-m01-04',
  imports: [SeverityFilter, IndicatorRow, LegacyRow],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  readonly items = signal<IndicatorView[]>(INDICATORS.filter(i => listOf(i).kind === 'THREAT'));
  readonly severities = signal<Severity[]>([]);
  readonly picked = signal<IndicatorView | null>(null);

  readonly visible = computed(() => {
    const wanted = this.severities();
    return wanted.length === 0 ? this.items() : this.items().filter(i => wanted.includes(riskLevel(i.score)));
  });

  onPicked(i: IndicatorView) {
    this.picked.set(i);
  }

  onRemove(id: number) {
//@@sol
    this.items.update(list => list.filter(i => i.id !== id));
    if (this.picked()?.id === id) this.picked.set(null);
//@@stub
    // TODO 6: remove the indicator with this id from `items` (immutably, with .update and .filter),
    //         and clear `picked` if it was the removed one
//@@end
  }
}
