import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export const checks = { total: 0 };

@Component({
  selector: 'aegis-point-row',
  // TODO 1: this row only changes when its input changes, so let Angular skip it otherwise.
  //         Remove this Eager override (OnPush is the v22 default) or write ChangeDetectionStrategy.OnPush.
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<span class="mono">{{ name() }}</span> <span class="muted">{{ countCheck() }}</span>`,
  styles: `:host { display: flex; justify-content: space-between; padding: 2px 8px; font-size: 12px; border-bottom: 1px solid var(--border); }`,
})
export class PointRow {
  readonly name = input.required<string>();
  private n = 0;
  countCheck() {
    checks.total++;
    return `checked ×${++this.n}`;
  }
}
