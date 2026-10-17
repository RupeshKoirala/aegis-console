import { Component } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { IndicatorCard } from './indicator-card';
import { LegacyIndicatorCard } from './legacy-indicator-card';

@Component({
  selector: 'app-m01-03',
  imports: [IndicatorCard, LegacyIndicatorCard],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  protected readonly withDescription = INDICATORS.filter(i => i.description);
  protected readonly threats = INDICATORS.filter(i => listOf(i).kind === 'THREAT').slice(0, 4);
  protected readonly kindOf = (i: (typeof INDICATORS)[number]) => listOf(i).kind;
}
