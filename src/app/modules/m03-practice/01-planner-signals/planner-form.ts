import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlannerService } from './planner.service';

@Component({
  selector: 'aegis-planner-form',
  imports: [FormsModule],
  templateUrl: './planner-form.html',
  styleUrl: './planner-form.css',
})
export class PlannerForm {
  static readonly DEFAULTS = { currentSize: 250_000, dailyAdditions: 4_000, monthlyGrowthPct: 10, expiryDays: 90, months: 12 };
  readonly capacity = 1_000_000;
  // TODO 4: inject the PlannerService, and create one writable signal per field, starting at DEFAULTS:
  //         currentSize, dailyAdditions, monthlyGrowthPct, expiryDays, months

  submit() {
    // TODO 5: call planner.plan({...}) with every signal's value plus capacity: this.capacity
  }

  reset() {
    // TODO 6b: set every signal back to its DEFAULTS value
  }
}
