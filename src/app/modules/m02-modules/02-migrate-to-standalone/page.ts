import { Component } from '@angular/core';
import { ReportsModule } from './reports.module';

@Component({
  selector: 'app-m02-02',
  // TODO 4: import ReportsListComponent directly instead of the module
  imports: [ReportsModule],
  template: `
    <h1>Weekly reports</h1>
    <aegis-reports-list />
  `,
})
export class Page {}
