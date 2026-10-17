import { Component } from '@angular/core';
import { ReportsListComponent } from './reports-list.component';

@Component({
  selector: 'app-m02-02',
  imports: [ReportsListComponent],
  template: `
    <h1>Weekly reports</h1>
    <aegis-reports-list />
  `,
})
export class Page {}
