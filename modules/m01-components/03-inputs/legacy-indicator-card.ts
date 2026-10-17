//@@sol
import { Component, Input, OnChanges, SimpleChanges, booleanAttribute, numberAttribute } from '@angular/core';
//@@stub
import { Component } from '@angular/core';
import { INDICATORS } from '../../../shared/domain/sample-data';
//@@end
import { IndicatorView, ListKind } from '../../../shared/domain/models';

/** Gen 1 style. You'll find thousands of components like this in real codebases. */
@Component({
  selector: 'aegis-legacy-indicator-card',
  templateUrl: './legacy-indicator-card.html',
  styleUrl: './card.css',
})
//@@sol
export class LegacyIndicatorCard implements OnChanges {
  @Input({ required: true }) indicator!: IndicatorView;
  @Input({ alias: 'kind', required: true }) listKind!: ListKind;
  @Input({ transform: booleanAttribute }) compact = false;
  @Input({ transform: numberAttribute }) maxDescription = 60;

  shortDescription: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicator'] || changes['maxDescription']) {
      const d = this.indicator.description;
      this.shortDescription = !d ? null : d.length > this.maxDescription ? d.slice(0, this.maxDescription) + '…' : d;
    }
  }
//@@stub
export class LegacyIndicatorCard {
  // TODO 5: decorate these fields with @Input (import Input from '@angular/core'):
  //   indicator      → @Input({ required: true })
  //   listKind       → public name "kind", also required:  @Input({ alias: 'kind', required: true })
  //   compact        → @Input({ transform: booleanAttribute })
  //   maxDescription → @Input({ transform: numberAttribute })
  indicator: IndicatorView = INDICATORS[0];
  listKind: ListKind = 'ALLOW';
  compact = false;
  maxDescription = 60;

  shortDescription: string | null = null;

  // TODO 6: add `implements OnChanges` to the class and an ngOnChanges(changes: SimpleChanges) method.
  // TODO 7: inside it, when changes['indicator'] or changes['maxDescription'] exists, recompute
  //         this.shortDescription with the same rule as the signal card (null / cut + "…" / unchanged).
//@@end
}
