import { Component, Input, OnChanges, SimpleChanges, booleanAttribute, numberAttribute } from '@angular/core';
import { IndicatorView, ListKind } from '../../../shared/domain/models';

/** Gen 1 style. You'll find thousands of components like this in real codebases. */
@Component({
  selector: 'aegis-legacy-indicator-card',
  templateUrl: './legacy-indicator-card.html',
  styleUrl: './card.css',
})
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
}
