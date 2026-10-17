import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlannerInput } from './projection';

@Component({
  selector: 'aegis-legacy-planner-form',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './legacy-planner-form.html',
  styleUrl: '../01-planner-signals/planner-form.css',
})
export class LegacyPlannerForm {
  readonly defaults = { currentSize: 250_000, dailyAdditions: 4_000, monthlyGrowthPct: 10, expiryDays: 90, months: 12 };
  currentSize = this.defaults.currentSize;
  dailyAdditions = this.defaults.dailyAdditions;
  monthlyGrowthPct = this.defaults.monthlyGrowthPct;
  expiryDays = this.defaults.expiryDays;
  months = this.defaults.months;

  @Output() calculate = new EventEmitter<PlannerInput>();

  submit() {
    this.calculate.emit({
      currentSize: this.currentSize,
      dailyAdditions: this.dailyAdditions,
      monthlyGrowthPct: this.monthlyGrowthPct,
      expiryDays: this.expiryDays,
      months: this.months,
      capacity: 1_000_000,
    });
  }
}
