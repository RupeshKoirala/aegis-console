# M04 · Debugging

📖 **Read first (Study Hub):** `foundations/l18` DevTools panel by panel · `toolkit/l4` debugging like a pro · `angular-manual/m17` testing & tooling

These exercises have **no TODO hints**. Each file says how many bugs it contains, and the tests are your oracle: they describe correct behaviour. Find each bug with the tools below, fix it, and turn the tests green.

## Your debugging toolkit
| Tool | Use it for |
|---|---|
| **Read the whole error**, especially the `NG0xxx` code | Every Angular runtime error links to `angular.dev/errors/NG0xxx` with causes and fixes |
| **Sources panel → breakpoints** (or `debugger;`) | Pause, inspect variables, step through. Conditional breakpoints (right-click) are gold in loops |
| **`ng.getComponent(el)`** in the console | Select an element in *Elements*, then run `ng.getComponent($0)` to read a component's live state |
| **Angular DevTools** (browser extension) | Component tree, signal values, injector tree, and the **profiler** (what re-rendered and why) |
| **The failing test** | `npm run ex -- m04/01` shows the expected value and the actual value |

## Compiler errors: a 10-minute lab (do it once)
Open `01-runtime-bugs/compile-lab.ts`. Each commented line causes a classic build error. Uncomment **one** line, read the error in the `npm start` terminal, then comment it back:
- `NG8001` *'x' is not a known element*: a missing component import
- `NG8002` *Can't bind to 'x' since it isn't a known property*: a missing input, or a typo
- `NG8004` *No pipe found with name*: a missing pipe import
- `TS2339` *Property 'x' does not exist on type*: a template typo, caught by strict templates
