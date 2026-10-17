//@@sol
import { Component, inject, signal } from '@angular/core';
//@@stub
import { Component } from '@angular/core';
//@@end
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
//@@sol
  private readonly planner = inject(PlannerService);
  readonly currentSize = signal(PlannerForm.DEFAULTS.currentSize);
  readonly dailyAdditions = signal(PlannerForm.DEFAULTS.dailyAdditions);
  readonly monthlyGrowthPct = signal(PlannerForm.DEFAULTS.monthlyGrowthPct);
  readonly expiryDays = signal(PlannerForm.DEFAULTS.expiryDays);
  readonly months = signal(PlannerForm.DEFAULTS.months);

  submit() {
    this.planner.plan({
      currentSize: this.currentSize(),
      dailyAdditions: this.dailyAdditions(),
      monthlyGrowthPct: this.monthlyGrowthPct(),
      expiryDays: this.expiryDays(),
      months: this.months(),
      capacity: this.capacity,
    });
  }

  reset() {
    this.currentSize.set(PlannerForm.DEFAULTS.currentSize);
    this.dailyAdditions.set(PlannerForm.DEFAULTS.dailyAdditions);
    this.monthlyGrowthPct.set(PlannerForm.DEFAULTS.monthlyGrowthPct);
    this.expiryDays.set(PlannerForm.DEFAULTS.expiryDays);
    this.months.set(PlannerForm.DEFAULTS.months);
  }
//@@stub
  // TODO 4: inject the PlannerService, and create one writable signal per field, starting at DEFAULTS:
  //         currentSize, dailyAdditions, monthlyGrowthPct, expiryDays, months

  submit() {
    // TODO 5: call planner.plan({...}) with every signal's value plus capacity: this.capacity
  }

  reset() {
    // TODO 6b: set every signal back to its DEFAULTS value
  }
//@@end
}
