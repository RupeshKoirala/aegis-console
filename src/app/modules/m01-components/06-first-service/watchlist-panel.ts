import { Component, computed, inject } from '@angular/core';
import { INDICATORS } from '../../../shared/domain/sample-data';
import { WatchlistService } from './watchlist.service';

@Component({
  selector: 'aegis-watchlist-panel',
  template: `
    <h3>My watchlist <span class="count">({{ watchlist.count() }})</span></h3>
    @for (i of items(); track i.id) {
      <p class="watched mono">{{ i.value }} <small class="muted">{{ i.category }}</small></p>
    } @empty {
      <p class="muted empty">Nothing watched yet</p>
    }
    <button class="clear" [disabled]="watchlist.count() === 0" (click)="watchlist.clear()">Clear</button>
  `,
  styles: `.watched { margin: 6px 0; } .count { color: var(--muted); font-weight: 400; }`,
})
export class WatchlistPanel {
  protected readonly watchlist = inject(WatchlistService);
  protected readonly items = computed(() => INDICATORS.filter(i => this.watchlist.watched().includes(i.id)));
}
