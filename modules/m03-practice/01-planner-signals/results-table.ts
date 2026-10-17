//@@sol
import { Component, inject } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
//@@stub
import { Component } from '@angular/core';
//@@end
import { PlannerService } from './planner.service';

@Component({
  selector: 'aegis-results-table',
//@@sol
  imports: [DecimalPipe, PercentPipe],
//@@stub
  // TODO 7a: import DecimalPipe and PercentPipe (from '@angular/common') once you use them in the template
  imports: [],
//@@end
  templateUrl: './results-table.html',
  styleUrl: './results-table.css',
})
export class ResultsTable {
//@@sol
  protected readonly planner = inject(PlannerService);
//@@stub
  // TODO 7b: inject the PlannerService as `planner` (protected readonly)
//@@end
  protected readonly warnAt = 0.8;
}
