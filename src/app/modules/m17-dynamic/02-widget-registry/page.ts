import { Component, resource, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { WidgetConfig, resolveLayout } from './registry';

export const ANALYST_LAYOUT: WidgetConfig[] = [
  { type: 'stat', inputs: { label: 'Blocks today', value: '1,204' } },
  { type: 'stat', inputs: { label: 'Open alerts', value: 7 } },
  { type: 'blocks-chart' },
  { type: 'top-iocs', inputs: { limit: 3 } },
];
export const MANAGER_LAYOUT: WidgetConfig[] = [
  { type: 'stat', inputs: { label: 'Tenants protected', value: 2 } },
  { type: 'top-iocs', inputs: { limit: 5 } },
  { type: 'world-map' },
];

@Component({
  selector: 'app-m17-02',
  imports: [NgComponentOutlet],
  template: `
    <h1>Configurable dashboard <small class="muted">NgComponentOutlet + lazy registry</small></h1>
    <div class="row">
      <button (click)="layout.set(analyst)">Analyst layout</button>
      <button class="manager" (click)="layout.set(manager)">Manager layout</button>
    </div>
    @if (widgets.isLoading()) { <p class="muted">Loading widgets…</p> }
    <div class="grid dash">
      @for (w of widgets.value(); track $index) {
        <!-- TODO 3: render each resolved widget: <ng-container *ngComponentOutlet="w.component; inputs: w.inputs" /> -->
      }
    </div>
  `,
  styles: `.dash { margin-top: 12px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }`,
})
export class Page {
  protected readonly analyst = ANALYST_LAYOUT;
  protected readonly manager = MANAGER_LAYOUT;
  readonly layout = signal<WidgetConfig[]>(ANALYST_LAYOUT);
  /** Async work as a signal (M10.04): re-resolves whenever the layout changes. */
  readonly widgets = resource({ params: () => this.layout(), loader: ({ params }) => resolveLayout(params), defaultValue: [] });
}
