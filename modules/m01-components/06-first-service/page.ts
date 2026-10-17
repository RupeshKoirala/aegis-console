import { Component } from '@angular/core';
import { IndicatorPicker } from './indicator-picker';
import { WatchlistPanel } from './watchlist-panel';

@Component({
  selector: 'app-m01-06',
  imports: [IndicatorPicker, WatchlistPanel],
  template: `
    <h1>Watchlist</h1>
    <p class="muted">Two independent components, one shared service.</p>
    <div class="split">
      <aegis-indicator-picker class="card" />
      <aegis-watchlist-panel class="card" />
    </div>
  `,
  styles: `.split { display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; } :host ::ng-deep h3 { margin-top: 0; }`,
})
export class Page {}
