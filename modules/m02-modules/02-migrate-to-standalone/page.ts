import { Component } from '@angular/core';
//@@sol
import { ReportsListComponent } from './reports-list.component';
//@@stub
import { ReportsModule } from './reports.module';
//@@end

@Component({
  selector: 'app-m02-02',
//@@sol
  imports: [ReportsListComponent],
//@@stub
  // TODO 4: import ReportsListComponent directly instead of the module
  imports: [ReportsModule],
//@@end
  template: `
    <h1>Weekly reports</h1>
    <aegis-reports-list />
  `,
})
export class Page {}
