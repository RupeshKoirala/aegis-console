import { Component, inject, signal } from '@angular/core';
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
}
