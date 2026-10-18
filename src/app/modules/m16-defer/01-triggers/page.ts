import { Component } from '@angular/core';
import { AttackChart, IocTable, ThreatMap } from '../widgets';

@Component({
  selector: 'app-m16-01',
  imports: [ThreatMap, IocTable, AttackChart],
  template: `
    <h1>Incident dashboard <small class="muted">&#64;defer triggers</small></h1>
    <p class="muted">Open DevTools → Network → JS, reload, then scroll and click. Each widget arrives as its own chunk.</p>
    <!-- TODO 1: the IOC table matters least: load it when the browser is idle (&#64;defer (on idle)),
         with an &#64;placeholder <div class="card skeleton ioc-placeholder">Top indicators…</div> -->
    <aegis-ioc-table />

    <div class="spacer">↓ scroll down for the map ↓</div>

    <!-- TODO 2: the map: &#64;defer (on viewport), plus
           &#64;placeholder (minimum 300ms)        <div class="card skeleton map-placeholder">…</div>
           &#64;loading (after 100ms; minimum 500ms) <div class="card skeleton map-loading">Loading map…</div>
           &#64;error                              <div class="card error-text map-error">The map failed to load.</div> -->
    <aegis-threat-map />

    <button #chartBtn class="chart-btn">Show attack chart</button>
    <!-- TODO 3: the chart only after a click on the button, but start DOWNLOADING its code on hover:
         &#64;defer (on interaction(chartBtn); prefetch on hover(chartBtn)) { … }
         &#64;placeholder { <p class="muted chart-placeholder">Click to load the chart…</p> } -->
    <aegis-attack-chart />
  `,
  styles: `.spacer { height: 120vh; display: grid; place-items: center; color: var(--muted); } .skeleton { min-height: 120px; opacity: .6; } .chart-btn { margin: 12px 0; }`,
})
export class Page {}
