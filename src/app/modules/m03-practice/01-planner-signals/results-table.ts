import { Component } from '@angular/core';
import { PlannerService } from './planner.service';

@Component({
  selector: 'aegis-results-table',
  // TODO 7a: import DecimalPipe and PercentPipe (from '@angular/common') once you use them in the template
  imports: [],
  templateUrl: './results-table.html',
  styleUrl: './results-table.css',
})
export class ResultsTable {
  // TODO 7b: inject the PlannerService as `planner` (protected readonly)
  protected readonly warnAt = 0.8;
}
