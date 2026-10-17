import { Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { IndicatorView, ListKind } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-indicator-card',
  templateUrl: './indicator-card.html',
  styleUrl: './card.css',
})
export class IndicatorCard {
  readonly indicator = input.required<IndicatorView>();
  readonly listKind = input.required<ListKind>({ alias: 'kind' });
  readonly compact = input(false, { transform: booleanAttribute });
  readonly maxDescription = input(60, { transform: numberAttribute });

  readonly shortDescription = computed(() => {
    const d = this.indicator().description;
    if (!d) return null;
    return d.length > this.maxDescription() ? d.slice(0, this.maxDescription()) + '…' : d;
  });
}
