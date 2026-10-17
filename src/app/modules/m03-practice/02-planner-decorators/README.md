# M03.02 · Capacity planner: the Gen 1 way  ⏱ 45 min

The same app, written the way most Angular code was written from 2016 to 2023. The maths (`projection.ts`) is given, so you only do the wiring.

## How it fits together (Gen 1)
```
<aegis-legacy-planner-form (calculate)="onCalculate($event)" />    ← @Output() + EventEmitter
                    │
            Page.rows = project(input)                             ← the parent owns plain-field state
                    │
<aegis-legacy-results-table [rows]="rows" />                       ← @Input()
```
- Plain class fields + `[(ngModel)]="currentSize"` (no signals).
- `changeDetection: ChangeDetectionStrategy.Eager` (formerly `Default`) on every component, like any pre-signals app. Angular re-checks everything after every event.
- Resetting the form the Gen 1 way: a template reference to the form directive, `#form="ngForm"`, then `form.resetForm(defaults)`.

## Your tasks
- `legacy-planner-form.ts`: TODO 1–2 · `.html`: TODO 3–4
- `legacy-results-table.ts`: TODO 5
- `page.ts` / `page.html`: TODO 6–7

## Check
`npm run ex -- m03/02`, then compare both planners in the app. They must produce the same numbers.

## Then reflect (5 minutes, worth it)
Open 01 and 02 side by side. Where does the state live in each? What re-renders when you type a number? In Gen 1, the whole tree is re-checked after **every** keystroke (Eager). In Gen 3 only the template that reads the changed signal updates. M09 measures that difference.
