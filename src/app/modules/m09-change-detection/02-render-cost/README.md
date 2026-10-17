# M09.02 · Measure the render cost  ⏱ 35 min

A live table of **200 enforcement points**. Only the *header* shows a fast-ticking "events/s" number (10 updates in the test). Each row counts how many times Angular checked it: `{{ countCheck() }}` runs whenever the row's template is evaluated.

With `ChangeDetectionStrategy.Eager` (Gen 1's Default) on the rows, **every tick re-checks all 200 rows**: 2,000 template evaluations for nothing. With **OnPush** (the v22 default), unchanged rows are skipped.

## Your task: `point-row.ts` TODO 1
Remove the `Eager` override (or set `OnPush` explicitly), then run the tests and compare the counts.

## Then measure it yourself (5 min)
Open the page, start the ticker, and record a few seconds with **Angular DevTools → Profiler**. Compare a run before and after your change: the bar chart shows exactly which components were checked on each tick.

## Senior notes
- Calling methods in templates (`{{ format(x) }}`) is only expensive when the component is checked often. OnPush plus signals makes that rare, and `computed` / pure pipes make it cheap.
- Big lists also need `track`, and for thousands of rows, virtualisation (M26).
