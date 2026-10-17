import { Component, inject } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { WatchlistService } from './watchlist.service';

@Component({
  selector: 'aegis-indicator-picker',
  template: `
    <h3>Threat indicators</h3>
    <ul>
      @for (i of threats; track i.id) {
        <li class="pick-row">
          <span class="mono">{{ i.value }}</span>
          <button class="toggle" [class.on]="watchlist.has(i.id)" (click)="watchlist.toggle(i.id)">
            {{ watchlist.has(i.id) ? '★ Watching' : '☆ Watch' }}
          </button>
        </li>
      }
    </ul>
  `,
  styles: `ul { list-style: none; padding: 0; margin: 0; } li { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); } .toggle.on { color: var(--threat); border-color: var(--threat); }`,
})
export class IndicatorPicker {
  protected readonly threats = INDICATORS.filter(i => listOf(i).kind === 'THREAT');
  protected readonly watchlist = inject(WatchlistService);
}
