import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DefangPipe } from './defang.pipe';
import { CidrSizePipe } from './cidr-size.pipe';
import { RelativeTimePipe } from './relative-time.pipe';
import { ALERTS, INDICATORS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-m07-02',
  imports: [DefangPipe, CidrSizePipe, RelativeTimePipe, DecimalPipe],
  templateUrl: './page.html',
})
export class Page {
  protected readonly indicators = INDICATORS.filter(i => i.listId === 2 || i.listId === 5);
  protected readonly alerts = ALERTS;
  protected readonly now = '2026-10-15T12:00:00Z';
}
