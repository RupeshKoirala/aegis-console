import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IndicatorView } from '../../../shared/domain/models';

/** Gen 1 style: @Input / @Output + EventEmitter. */
@Component({
  selector: 'aegis-legacy-row',
  template: `
    <div class="legacy-row">
      <span class="mono">{{ indicator.value }}</span>
      <button class="remove" (click)="onRemove()">Remove</button>
    </div>
  `,
  styles: `.legacy-row { display: flex; justify-content: space-between; padding: 6px 12px; border-bottom: 1px dashed var(--border); }`,
})
export class LegacyRow {
  @Input({ required: true }) indicator!: IndicatorView;
  @Output() removeRequested = new EventEmitter<number>();

  onRemove() {
    this.removeRequested.emit(this.indicator.id);
  }
}
