import { Component, HostBinding, HostListener, Input } from '@angular/core';

/** Gen 1: the same host behaviour with decorators. */
@Component({
  selector: 'aegis-legacy-stat-tile',
  template: `<p class="label">{{ label }}</p><p class="value">{{ value }}</p>`,
  styles: `:host { display: block; padding: 14px; border: 1px dashed var(--border); border-radius: 12px; } :host(.breach) { border-color: var(--block); } .label { margin: 0; color: var(--muted); font-size: 13px; } .value { margin: 4px 0 0; font-size: 22px; }`,
})
export class LegacyStatTile {
  @Input() label = '';
  @Input() value = 0;
  @Input() limit = Infinity;
  clicks = 0;

  @HostBinding('class.breach')
  get breach(): boolean {
    return this.value >= this.limit;
  }

  @HostListener('click')
  onClick() {
    this.clicks++;
  }
}
