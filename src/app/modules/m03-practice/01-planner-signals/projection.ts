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
  const rows: ProjectionRow[] = [];
  let previous = input.currentSize;
  for (let month = 1; month <= input.months; month++) {
    const daily = input.dailyAdditions * Math.pow(1 + input.monthlyGrowthPct / 100, month);
    const added = Math.round(daily * 30);
    const expired = Math.round(previous * Math.min(1, 30 / input.expiryDays));
    const total = previous + added - expired;
    rows.push({ month, added, expired, total, utilization: total / input.capacity });
    previous = total;
  }
  return rows;
}
