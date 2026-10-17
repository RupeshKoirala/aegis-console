import { Component } from '@angular/core';

@Component({
  selector: 'app-m02-01',
  // TODO 4a: a standalone component can import an NgModule and use its exports  →  imports: [AdminModule]
  imports: [],
  template: `
    <h1>Tenant users <small class="muted">(NgModule-based)</small></h1>
    <!-- TODO 4b: <aegis-user-table /> -->
  `,
})
export class Page {}
