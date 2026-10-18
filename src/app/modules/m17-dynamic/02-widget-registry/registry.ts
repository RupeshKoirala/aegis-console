import { Type } from '@angular/core';
import { UnknownWidget } from './widgets/unknown-widget';

/** One entry of a saved dashboard (it would come from GET /api/v1/settings in a real console). */
export interface WidgetConfig {
  type: string;
  inputs?: Record<string, unknown>;
}

export interface ResolvedWidget {
  component: Type<unknown>;
  inputs: Record<string, unknown>;
}

/**
 * TODO 1: the registry: widget type → a LAZY loader. Each import() becomes its own chunk, so a dashboard only
 * downloads the widgets it actually shows.
 *   'stat'         → () => import('./widgets/stat-widget').then(m => m.default)
 *   'top-iocs'     → ./widgets/top-iocs-widget
 *   'blocks-chart' → ./widgets/blocks-chart-widget
 */
export const WIDGETS: Record<string, () => Promise<Type<unknown>>> = {
  stat: () => import('./widgets/stat-widget').then(m => m.default),
  'top-iocs': () => import('./widgets/top-iocs-widget').then(m => m.default),
  'blocks-chart': () => import('./widgets/blocks-chart-widget').then(m => m.default),
};

/**
 * TODO 2: load every widget of a layout IN PARALLEL (Promise.all), keeping the order.
 * Unknown types → { component: UnknownWidget, inputs: { type } } (never crash the whole dashboard on a bad entry).
 */
export async function resolveLayout(layout: WidgetConfig[]): Promise<ResolvedWidget[]> {
  return Promise.all(
    layout.map(async w => {
      const load = WIDGETS[w.type];
      return load ? { component: await load(), inputs: w.inputs ?? {} } : { component: UnknownWidget, inputs: { type: w.type } };
    }),
  );
}
