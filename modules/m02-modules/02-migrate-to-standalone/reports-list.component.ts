import { Component } from '@angular/core';
//@@sol
import { NgForOf } from '@angular/common';
import { ReportCardComponent } from './report-card.component';
//@@end
import { REPORTS } from './reports';

@Component({
  selector: 'aegis-reports-list',
//@@sol
  imports: [NgForOf, ReportCardComponent],
//@@stub
  // TODO 2: standalone too: delete `standalone: false`, import NgForOf and ReportCardComponent
  standalone: false,
//@@end
  template: `<div class="grid"><aegis-report-card *ngFor="let r of reports" [report]="r" /></div>`,
})
export class ReportsListComponent {
  reports = REPORTS;
}
