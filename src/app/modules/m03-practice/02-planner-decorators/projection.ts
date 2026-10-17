// Same model as M03.01, given here so this exercise is only about the Gen 1 wiring.
export interface PlannerInput { currentSize: number; dailyAdditions: number; monthlyGrowthPct: number; expiryDays: number; months: number; capacity: number; }
export interface ProjectionRow { month: number; added: number; expired: number; total: number; utilization: number; }

export function project(input: PlannerInput): ProjectionRow[] {
  const rows: ProjectionRow[] = [];
  let previous = input.currentSize;
  for (let month = 1; month <= input.months; month++) {
    const added = Math.round(input.dailyAdditions * Math.pow(1 + input.monthlyGrowthPct / 100, month - 1) * 30);
    const expired = Math.round(previous * Math.min(1, 30 / input.expiryDays));
    const total = previous + added - expired;
    rows.push({ month, added, expired, total, utilization: total / input.capacity });
    previous = total;
  }
  return rows;
}
