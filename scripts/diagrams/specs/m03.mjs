export default {
  id: 'm03',
  title: 'M03 · Capacity planner, built twice',
  lead: 'Same feature, two generations. Left: siblings share a signal service. Right: the Gen 1 way — child @Output up to the parent, parent @Input down to the other child.',
  groups: [
    ['01 the v22 way (signals + service)', 0, 0, 1, 3],
    ['02 the Gen 1 way (@Input / @Output)', 2, 0, 3, 2],
  ],
  nodes: [
    ['p1', 'comp', 'Page', '01-planner-signals/page.ts', 0.5, 0],
    ['form', 'comp', 'PlannerForm', 'planner-form.ts', 0, 1],
    ['table', 'comp', 'ResultsTable', 'results-table.ts', 1, 1],
    ['svc', 'svc', 'PlannerService', 'input signal → rows computed', 0.5, 2],
    ['proj', 'fn', 'project()', 'projection.ts', 0.5, 3, { hot: true }],
    ['p2', 'comp', 'Page (holds input)', '02-planner-decorators/page.ts', 2.5, 0],
    ['lform', 'comp', 'LegacyPlannerForm', 'legacy-planner-form.ts', 2, 1],
    ['ltable', 'comp', 'LegacyResultsTable', 'legacy-results-table.ts', 3, 1],
    ['proj2', 'fn', 'project()', '02…/projection.ts', 2.5, 2],
  ],
  edges: [
    ['p1', 'form', 'call', 'renders'],
    ['p1', 'table', 'call', 'renders'],
    ['form', 'svc', 'di', 'input.set(…)'],
    ['table', 'svc', 'di', 'rows()'],
    ['svc', 'proj', 'call', 'computed → project(input)'],
    ['lform', 'p2', 'event', '(calculate)'],
    ['p2', 'ltable', 'data', '[rows]'],
    ['p2', 'proj2', 'call', 'project(input)', { t: 0.82 }],
  ],
  notes: [
    'Debug both: in 01 put a breakpoint inside the computed; in 02 inside the ngOnChanges/setter of the table. Count how many times each runs when you type one digit.',
    'project() is a pure function: same input → same rows. Unit-test it without any component.',
  ],
};
