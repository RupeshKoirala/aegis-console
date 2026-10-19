import { Component, computed, inject, input } from '@angular/core';
import { levelFor, RISK_THRESHOLDS } from './risk';

// Nothing to fix in here. Select this component in Angular DevTools and read its properties.
@Component({
  selector: 'aegis-risk-gauge',
  template: `
    <div class="gauge" [class]="level()">
      <span class="name">{{ name() }}</span>
      <span class="bar"><span class="fill" [style.width.%]="score()"></span></span>
      <span class="score mono">{{ score() }}</span>
      <span class="level">{{ level() }}</span>
    </div>
  `,
  styles: `
    .gauge { display: grid; grid-template-columns: 140px 1fr 40px 80px; gap: 12px; align-items: center; padding: 8px 0; }
    .bar { height: 8px; background: var(--surface-2); border-radius: 4px; overflow: hidden; }
    .fill { display: block; height: 100%; background: var(--accent); }
    .level { font-weight: 700; font-size: 12px; }
    .HIGH .level { color: #ef4444; } .MEDIUM .level { color: #f59e0b; } .LOW .level { color: #22c55e; }
  `,
})
export class RiskGauge {
  readonly name = input.required<string>();
  readonly score = input.required<number>();
  /** Visible in Angular DevTools → Components → properties. Where did this value come from? */
  protected readonly thresholds = inject(RISK_THRESHOLDS);
  protected readonly level = computed(() => levelFor(this.score(), this.thresholds));
}
