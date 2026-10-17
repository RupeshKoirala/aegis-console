import { Component, inject } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { PlannerService } from './planner.service';

@Component({
  selector: 'aegis-results-table',
  imports: [DecimalPipe, PercentPipe],
  templateUrl: './results-table.html',
  styleUrl: './results-table.css',
})
export class ResultsTable {
  protected readonly planner = inject(PlannerService);
  protected readonly warnAt = 0.8;
}
