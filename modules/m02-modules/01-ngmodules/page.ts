import { Component } from '@angular/core';
//@@sol
import { AdminModule } from './admin.module';
//@@end

@Component({
  selector: 'app-m02-01',
//@@sol
  imports: [AdminModule],
//@@stub
  // TODO 4a: a standalone component can import an NgModule and use its exports  →  imports: [AdminModule]
  imports: [],
//@@end
  template: `
    <h1>Tenant users <small class="muted">(NgModule-based)</small></h1>
<!--@@sol-->
    <aegis-user-table />
<!--@@stub-->
    <!-- TODO 4b: <aegis-user-table /> -->
<!--@@end-->
  `,
})
export class Page {}
