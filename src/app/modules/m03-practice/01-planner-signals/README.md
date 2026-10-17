# M03.01 · Capacity planner: the v22 way  ⏱ 60–75 min

## How it fits together
```
PlannerForm ──(submit)──▶ PlannerService.plan(input)       ← a signal holding the last input
                                   │
                         rows = computed(() => project(input()))
                                   │
ResultsTable ◀──── inject(PlannerService).rows()
```
The form and the table never talk to each other directly. The service is the single owner of the state.

## The model you implement (`projection.ts`)
For each month `m = 1..months`:
- `daily = dailyAdditions × (1 + monthlyGrowthPct/100)^(m-1)`
- `added = round(daily × 30)`
- `expired = round(previousTotal × min(1, 30 / expiryDays))`. Entries live `expiryDays` on average.
- `total = previousTotal + added − expired`, where the first `previousTotal` is `currentSize`
- `utilization = total / capacity` (a fraction; the template turns it into % with the `percent` pipe)

## Your tasks
1. `projection.ts`: TODO 1. The pure function. Test it first, because UI bugs are easier when the maths is right.
2. `planner.service.ts`: TODO 2–3
3. `planner-form.ts` + `.html`: TODO 4–6. Signals bound with `[(ngModel)]`, submit, reset.
4. `results-table.ts` + `.html`: TODO 7–8

## Check
`npm run ex -- m03/01`. Try 250,000 current entries with 4,000/day and 10% growth: when does the appliance cross 80%?

## Senior notes
- **Pure function + service + dumb components** is the shape of most good Angular features. The function is unit-testable without Angular, the service is the boundary, and the components only render.
- `[(ngModel)]="signal"` works since v17.2. Two-way binding writes straight into a `WritableSignal`.
- Number inputs: `<input type="number">` + `ngModel` gives you a `number` (or `null` when empty!). Real code must handle that `null`.
