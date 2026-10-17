import { Component, input } from '@angular/core';

@Component({
  selector: 'aegis-indicator-chip',
  // TODO 1: compose both behaviours:
  //   hostDirectives: [
  //     { directive: Tooltip, inputs: ['aegisTooltip: tip'] },
  //     { directive: Focusable, outputs: ['activated'] },
  //   ]
  template: `<span class="mono">{{ value() }}</span>`,
  styles: `:host { display: inline-block; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface-2); margin: 4px; } :host(:focus-visible) { outline: 2px solid var(--accent); }`,
})
export class IndicatorChip {
  readonly value = input.required<string>();
}
