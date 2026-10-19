export default {
  id: 'm09',
  title: 'M09 · Change detection: who re-renders, and when',
  lead: 'OnPush components re-check only when an input REFERENCE changes, an event fires inside them, or a signal they read changes. Zoneless apps rely on exactly these signals.',
  groups: [
    ['01 OnPush mechanics', 0, 0, 1, 1],
    ['02 render cost', 2, 0, 2, 1],
    ['03 ChangeDetectorRef', 3, 0, 3, 2],
    ['04 zoneless', 0, 2, 2, 2],
  ],
  nodes: [
    ['p1', 'comp', 'Page', 'alert = {...alert, status}', 0, 0, { hot: true }],
    ['card', 'comp', 'AlertCard (OnPush)', '[alert] input', 0, 1],
    ['sched', 'tool', 'Angular scheduler', 'no zone.js: waits for a signal', 2, 2],
    ['p2', 'comp', 'Page (ticker)', 'setInterval → points', 2, 0],
    ['row', 'comp', 'PointRow ×N', 'checks counter', 2, 1],
    ['legacy', 'comp', 'LegacyFeedStatus', 'cdr.markForCheck()', 3, 0],
    ['thr', 'comp', 'ThrottledCounter', 'cdr.detach() + detectChanges', 3, 1],
    ['cdr', 'ext', 'ChangeDetectorRef', 'per-component handle', 3, 2],
    ['fh', 'comp', 'FeedHealth', 'signals only, no zone.js', 0.5, 2],
  ],
  edges: [
    ['p1', 'card', 'data', 'NEW object ref'],
    ['fh', 'sched', 'event', 'signal.set() → render'],
    ['p2', 'row', 'data', '[name]'],
    ['legacy', 'cdr', 'di', 'inject'],
    ['thr', 'cdr', 'di', 'inject'],
  ],
  notes: [
    'Mutate alert.status in place and the OnPush card stays stale: same reference, nothing to compare. Replace the object instead.',
    'Angular DevTools → Profiler → record, click, stop: each bar is one change-detection pass; the flame chart shows which components were checked.',
  ],
};
