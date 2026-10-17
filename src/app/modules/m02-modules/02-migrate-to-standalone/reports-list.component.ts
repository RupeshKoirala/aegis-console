import { Component } from '@angular/core';
import { REPORTS } from './reports';

@Component({
  selector: 'aegis-reports-list',
  // TODO 2: standalone too: delete `standalone: false`, import NgForOf and ReportCardComponent
  standalone: false,
  template: `<div class="grid"><aegis-report-card *ngFor="let r of reports" [report]="r" /></div>`,
})
export class ReportsListComponent {
  reports = REPORTS;
}
