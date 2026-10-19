# M01 · Components & templates

📖 **Read first (Study Hub):** `angular/l8`–`l14` · `angular-manual/m3` components · `m4` template syntax & bindings · `m5` control flow · `m9` component communication

![M01 map: components, services and data flow](../../../../public/diagrams/m01.svg)

🧪 **After the exercises: [LAB.md](LAB.md)**: observe it in a debugger · break it on purpose · fix a seeded bug on a branch with one new git skill.

| # | Exercise | You practise |
|---|---|---|
| 01 | Every kind of binding | interpolation, property/attribute/class/style bindings, events, key filters, signals 101 |
| 02 | Control flow | `@for` + `track` + `$index/$first/$count`, `@empty`, `@if … as`, `@switch`, `@let` |
| 03 | Inputs | `input()`, `input.required()`, `alias`, `transform` **and** the legacy `@Input()` |
| 04 | Outputs & `model()` | `output()`, legacy `@Output()` + `EventEmitter`, two-way binding |
| 05 | Reading legacy templates | `*ngIf`/`*ngFor`/`[ngSwitch]`, `ngClass`, `ngStyle`, `ng-container` |
| 06 | A first shared service | `@Injectable`, `inject()`, sharing signal state between components |

**Angular 22 note:** components are **OnPush by default**. Angular re-renders a component when one of its inputs changes, when an event fires inside it, or when a **signal** it reads changes. That's why state lives in signals from the start. M09 explains the machinery.
