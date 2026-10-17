import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegacyPlannerForm } from './legacy-planner-form';
import { LegacyResultsTable } from './legacy-results-table';
import { PlannerInput, ProjectionRow, project } from './projection';

@Component({
  selector: 'app-m03-02',
  imports: [LegacyPlannerForm, LegacyResultsTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './page.html',
})
export class Page {
  rows: ProjectionRow[] = [];

  onCalculate(input: PlannerInput) {
    this.rows = project(input);
  }
}
