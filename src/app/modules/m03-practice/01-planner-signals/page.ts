import { Component } from '@angular/core';
import { PlannerForm } from './planner-form';
import { ResultsTable } from './results-table';

@Component({
  selector: 'app-m03-01',
  imports: [PlannerForm, ResultsTable],
  template: `
    <h1>Blocklist capacity planner <small class="muted">v22</small></h1>
    <p class="muted">Appliance capacity: 1,000,000 entries · warning at 80%</p>
    <aegis-planner-form />
    <aegis-results-table />
  `,
})
export class Page {}
