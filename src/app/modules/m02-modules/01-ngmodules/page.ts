import { Component } from '@angular/core';
import { AdminModule } from './admin.module';

@Component({
  selector: 'app-m02-01',
  imports: [AdminModule],
  template: `
    <h1>Tenant users <small class="muted">(NgModule-based)</small></h1>
    <aegis-user-table />
  `,
})
export class Page {}
