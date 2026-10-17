import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegacyPlannerForm } from './legacy-planner-form';
import { LegacyResultsTable } from './legacy-results-table';
//@@sol
import { PlannerInput, ProjectionRow, project } from './projection';
//@@stub
import { ProjectionRow } from './projection';
//@@end

@Component({
  selector: 'app-m03-02',
  imports: [LegacyPlannerForm, LegacyResultsTable],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './page.html',
})
export class Page {
  rows: ProjectionRow[] = [];

//@@sol
  onCalculate(input: PlannerInput) {
    this.rows = project(input);
  }
//@@stub
  // TODO 6: onCalculate(input: PlannerInput) { … }  → this.rows = project(input)
//@@end
}
