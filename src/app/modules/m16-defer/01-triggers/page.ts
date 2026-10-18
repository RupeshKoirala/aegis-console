import { Component } from '@angular/core';
import { AttackChart, IocTable, ThreatMap } from '../widgets';

@Component({
  selector: 'app-m16-01',
  imports: [ThreatMap, IocTable, AttackChart],
  template: `
    <h1>Incident dashboard <small class="muted">&#64;defer triggers</small></h1>
    <p class="muted">Open DevTools → Network → JS, reload, then scroll and click. Each widget arrives as its own chunk.</p>
    @defer (on idle) {
      <aegis-ioc-table />
    } @placeholder {
      <div class="card skeleton ioc-placeholder">Top indicators…</div>
    }

    <div class="spacer">↓ scroll down for the map ↓</div>

    @defer (on viewport) {
      <aegis-threat-map />
    } @placeholder (minimum 300ms) {
      <div class="card skeleton map-placeholder">Map loads when it scrolls into view</div>
    } @loading (after 100ms; minimum 500ms) {
      <div class="card skeleton map-loading">Loading map…</div>
    } @error {
      <div class="card error-text map-error">The map failed to load.</div>
    }

    <button #chartBtn class="chart-btn">Show attack chart</button>
    @defer (on interaction(chartBtn); prefetch on hover(chartBtn)) {
      <aegis-attack-chart />
    } @placeholder {
      <p class="muted chart-placeholder">Click to load the chart (it starts downloading when you hover).</p>
    }
  `,
  styles: `.spacer { height: 120vh; display: grid; place-items: center; color: var(--muted); } .skeleton { min-height: 120px; opacity: .6; } .chart-btn { margin: 12px 0; }`,
})
export class Page {}
