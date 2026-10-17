import { Component } from '@angular/core';
import { SmartTable } from './smart-table';
import { INDICATORS } from '../../../shared/domain/sample-data';
import { riskLevel } from '../../../shared/domain/risk';
import { Alert, IndicatorView } from '../../../shared/domain/models';

@Component({
  selector: 'app-m05-05',
  imports: [SmartTable],
  templateUrl: './page.html',
})
export class Page {
  protected readonly threats: IndicatorView[] = INDICATORS.filter(i => i.score !== null).slice(0, 5);
  protected readonly noAlerts: Alert[] = [];
  protected readonly tenants = [{ id: 1, name: 'Acme Schools' }, { id: 2, name: 'Globex Health' }];
  protected readonly level = riskLevel;
}
