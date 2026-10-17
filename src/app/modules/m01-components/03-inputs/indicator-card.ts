import { Component, computed, signal } from '@angular/core';
import { INDICATORS } from '../../../shared/domain/sample-data';
import { IndicatorView, ListKind } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-indicator-card',
  templateUrl: './indicator-card.html',
  styleUrl: './card.css',
})
export class IndicatorCard {
  // These placeholders let the template compile. Replace each one with a real input.
  // TODO 1: required input  →  input.required<IndicatorView>()
  readonly indicator = signal<IndicatorView>(INDICATORS[0]);
  // TODO 2: required input with the public name "kind"  →  input.required<ListKind>({ alias: 'kind' })
  readonly listKind = signal<ListKind>('ALLOW');
  // TODO 3: boolean input, default false, so that <aegis-indicator-card compact> works  →  transform: booleanAttribute
  readonly compact = signal(false);
  //         and a number input, default 60, so that maxDescription="20" works  →  transform: numberAttribute
  readonly maxDescription = signal(60);

  // TODO 4: null when there is no description; otherwise the description cut to maxDescription()
  //         characters with "…" appended (only when it was actually cut)
  readonly shortDescription = computed(() => this.indicator().description);
}
