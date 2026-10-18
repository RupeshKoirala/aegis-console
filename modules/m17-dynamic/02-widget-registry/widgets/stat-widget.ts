import { Component, input } from '@angular/core';

@Component({
  selector: 'aegis-stat-widget',
  template: `<div class="card widget stat"><small class="muted">{{ label() }}</small><div class="value">{{ value() }}</div></div>`,
  styles: `.value { font-size: 28px; font-weight: 700; }`,
})
export default class StatWidget {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
}
