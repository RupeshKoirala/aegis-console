# Debugging cheat sheet

Keep this open. Set-up and a guided tour are in **M00.03 · Your debugging bench**.

## Which tool answers which question?

| Question | Tool | How |
|---|---|---|
| What value does this component have **now**? | Angular DevTools → Components | select the node → Properties (inputs, signals, computed) |
| Which component rendered this element? | Console | Elements → select it → `ng.getOwningComponent($0)` |
| Where does this injected value come from? | Angular DevTools → Injector Tree | select the component → the injector that provides the token |
| **How** did the value get there? | Sources breakpoint | pause → Call Stack panel → click frames upward |
| How **often** does this run? | Logpoint / Profiler | right-click line → Add logpoint · Angular → Profiler |
| Why didn't the UI update? | Breakpoint in `computed` / OnPush child | doesn't pause → the signal/input never got a **new reference** |
| Did the server send it? What did I send? | Network | filter `/api` · Headers · Payload · Response · right-click → Copy as fetch / Replay |
| Which route/guard/resolver ran? | Angular DevTools → Router Tree; `withDebugTracing()` | M14 |
| Which NgRx action changed state? | Redux DevTools extension | M20 |
| Why did the build fail? | terminal | read the **first** error; NG8xxx = template, TS2xxx = types |
| Why does the test fail? | `npm run ex -- mNN/NN` + WebStorm/VS Code debugger | breakpoint in the spec, then step into your code |

## Console helpers (dev builds only)
```js
ng.getComponent($0)          // instance of the selected component element
ng.getOwningComponent($0)    // component whose template contains $0
ng.getDirectives($0)         // directives on $0
ng.getInjector($0)           // element injector; .get(Token) to resolve
ng.getContext($0)            // @for / ng-template context (e.g. $implicit, index)
ng.getListeners($0)          // (event) listeners on $0
ng.applyChanges(cmp)         // run change detection for that component after poking it
```
`$0` = element selected in Elements. `$_` = last console result.

## Breakpoints that save time
- **Logpoint**: logs without pausing or editing code. Best first step for "how often / in what order".
- **Conditional**: `id === 'globex'`, `items.length > 1000`.
- **XHR/fetch breakpoint** (Sources → right panel): pause when a URL containing `/api/indicators` is requested; the call stack shows *who* asked.
- **DOM breakpoint** (Elements → right-click node → Break on → subtree/attribute modifications): find who changes that element.
- **Pause on caught exceptions**: for errors swallowed by `catchError`.
- `debugger;` in code: quick, but never commit it.

## Error codes you'll meet
| Code | Means | Usually |
|---|---|---|
| NG0100 | ExpressionChangedAfterItHasBeenChecked | you changed state during render (in a getter or in `ngAfterViewInit`) |
| NG0200 | Circular dependency in DI | A injects B injects A |
| NG0201 | No provider found | missing `providers` / `providedIn`, or a modifier stopped the walk |
| NG0203 | `inject()` outside an injection context | `inject` inside a method or `computed`: move it to a field |
| NG0300 | Two components match one element | duplicate selector |
| NG0600 | Writing a signal inside `computed` / template | derive instead of writing |
| NG0955/0956 | `track` issues in `@for` | duplicate keys / tracking by identity on recreated objects |
| NG8001 | Unknown element | add the component to `imports` |
| NG8002 | Unknown property binding | wrong input name, or the input isn't declared |
| NG8004 | No pipe found | add the pipe to `imports` |

## The loop
1. **Reproduce** (ideally as a failing test).
2. **Observe** with the right tool (table above). Don't change code yet.
3. **Hypothesise** in one sentence: "the computed doesn't re-run because the reference is the same."
4. **Prove** it with a breakpoint/logpoint, then fix the smallest thing.
5. **Lock it in**: the test stays as a regression test.
