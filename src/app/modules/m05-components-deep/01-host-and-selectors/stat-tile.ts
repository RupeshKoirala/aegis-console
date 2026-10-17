import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'aegis-stat-tile',
  imports: [DecimalPipe],
  host: {
    role: 'status',
    '[class.breach]': 'breached()',
    '[class.expanded]': 'expanded()',
    '[attr.aria-label]': 'label() + ": " + value()',
    '(click)': 'expanded.set(!expanded())',
  },
  template: `
    <p class="label">{{ label() }}</p>
    <p class="value">{{ value() | number }}</p>
    @if (expanded()) { <p class="hint">Limit {{ limit() | number }}</p> }
  `,
  styles: `
    :host { display: block; padding: 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); cursor: pointer; }
    :host(.breach) { border-color: var(--block); box-shadow: 0 0 0 1px var(--block); }
    .label { margin: 0; color: var(--muted); font-size: 13px; } .value { margin: 4px 0 0; font-size: 26px; font-weight: 700; } .hint { margin: 6px 0 0; font-size: 12px; color: var(--muted); }
  `,
})
export class StatTile {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly limit = input(Infinity);
  readonly expanded = signal(false);
  readonly breached = computed(() => this.value() >= this.limit());
}
