import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCardComponent } from './report-card.component';
import { ReportsListComponent } from './reports-list.component';

// TODO 3: after TODO 1 + 2 this module is useless. Delete its contents (leave `export {};` so the file still compiles).
@NgModule({
  declarations: [ReportCardComponent, ReportsListComponent],
  imports: [CommonModule],
  exports: [ReportsListComponent],
})
export class ReportsModule {}
