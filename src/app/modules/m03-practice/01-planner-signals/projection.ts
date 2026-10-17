export interface PlannerInput {
  currentSize: number;
  dailyAdditions: number;
  monthlyGrowthPct: number;
  expiryDays: number;
  months: number;
  capacity: number;
}

export interface ProjectionRow {
  month: number;
  added: number;
  expired: number;
  total: number;
  /** total / capacity, e.g. 0.83 */
  utilization: number;
}

export function project(input: PlannerInput): ProjectionRow[] {
  // TODO 1: implement the model from the README. One row per month, months 1..input.months.
  return [];
}
