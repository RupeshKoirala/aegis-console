import { Component } from '@angular/core';

@Component({
  selector: 'aegis-blocks-chart-widget',
  template: `<div class="card widget blocks-chart"><small class="muted">Blocks per hour</small>
    <div class="bars">@for (v of values; track $index) { <div class="bar" [style.height.px]="v"></div> }</div></div>`,
  styles: `.bars { display: flex; gap: 3px; align-items: flex-end; height: 70px; } .bar { width: 10px; background: var(--accent); }`,
})
export default class BlocksChartWidget {
  protected readonly values = [12, 30, 22, 48, 66, 40, 28, 58];
}
