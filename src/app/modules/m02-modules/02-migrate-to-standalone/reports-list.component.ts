import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ReportCardComponent } from './report-card.component';
import { REPORTS } from './reports';

@Component({
  selector: 'aegis-reports-list',
  imports: [NgForOf, ReportCardComponent],
  template: `<div class="grid"><aegis-report-card *ngFor="let r of reports" [report]="r" /></div>`,
})
export class ReportsListComponent {
  reports = REPORTS;
}
