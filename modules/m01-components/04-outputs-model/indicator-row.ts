//@@sol
import { Component, booleanAttribute, input, output } from '@angular/core';
//@@stub
import { Component, booleanAttribute, input } from '@angular/core';
//@@end
import { IndicatorView } from '../../../shared/domain/models';
import { riskLevel } from '../../../shared/domain/risk';

@Component({
  selector: 'aegis-indicator-row',
  template: `
    <div class="row-item" [class.active]="active()" (click)="pick()">
      <span class="sev" [class]="level()">{{ level() }}</span>
      <span class="mono value">{{ indicator().value }}</span>
      <span class="muted">{{ indicator().category }}</span>
      <button class="remove" aria-label="Remove" (click)="remove($event)">✕</button>
    </div>
  `,
  styles: `
    .row-item { display: grid; grid-template-columns: 90px 1fr 140px 36px; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid var(--border); cursor: pointer; }
    .row-item:hover, .row-item.active { background: var(--surface-2); }
    .sev { font-size: 12px; } .remove { padding: 2px 8px; }
  `,
})
export class IndicatorRow {
  readonly indicator = input.required<IndicatorView>();
  readonly active = input(false, { transform: booleanAttribute });
  protected readonly level = () => riskLevel(this.indicator().score);
//@@sol
  readonly picked = output<IndicatorView>();
  readonly removeRequested = output<number>();

  pick() {
    this.picked.emit(this.indicator());
  }

  remove(event: MouseEvent) {
    event.stopPropagation();
    this.removeRequested.emit(this.indicator().id);
  }
//@@stub
  // TODO 3: two outputs: `picked` emitting an IndicatorView, `removeRequested` emitting the indicator id (number)

  pick() {
    // TODO 4a: emit the current indicator on `picked`
  }

  remove(event: MouseEvent) {
    // TODO 4b: stop the click from ALSO reaching the row (event.stopPropagation()), then emit the id on `removeRequested`
  }
//@@end
}
