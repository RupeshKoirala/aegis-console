import { Component, input } from '@angular/core';
//@@sol
import { Tooltip } from './tooltip.directive';
import { Focusable } from './focusable.directive';
//@@end

@Component({
  selector: 'aegis-indicator-chip',
//@@sol
  hostDirectives: [
    { directive: Tooltip, inputs: ['aegisTooltip: tip'] },
    { directive: Focusable, outputs: ['activated'] },
  ],
//@@stub
  // TODO 1: compose both behaviours:
  //   hostDirectives: [
  //     { directive: Tooltip, inputs: ['aegisTooltip: tip'] },
  //     { directive: Focusable, outputs: ['activated'] },
  //   ]
//@@end
  template: `<span class="mono">{{ value() }}</span>`,
  styles: `:host { display: inline-block; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface-2); margin: 4px; } :host(:focus-visible) { outline: 2px solid var(--accent); }`,
})
export class IndicatorChip {
  readonly value = input.required<string>();
}
