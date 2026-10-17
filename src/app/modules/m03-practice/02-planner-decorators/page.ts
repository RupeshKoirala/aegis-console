import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegacyPlannerForm } from './legacy-planner-form';
import { LegacyResultsTable } from './legacy-results-table';
import { ProjectionRow } from './projection';

@Component({
  selector: 'app-m03-02',
  imports: [LegacyPlannerForm, LegacyResultsTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './page.html',
})
export class Page {
  rows: ProjectionRow[] = [];

  // TODO 6: onCalculate(input: PlannerInput) { … }  → this.rows = project(input)
}
