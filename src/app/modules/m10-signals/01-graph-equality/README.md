# M10.01 · The reactive graph & equality  ⏱ 40 min

```
query ─┐
       ├─► filtered ─► count
kind ──┘          └─► topScore
```
- **Dependency tracking:** a `computed` depends on exactly the signals it **read during its last run**. Read `kind()` only inside an `if`, and it's only a dependency when that branch runs.
- **Lazy:** a `computed` doesn't run until someone reads it, and is cached until a dependency changes.
- **Glitch-free:** readers never see half-updated state.
- **Equality:** a signal only notifies dependents when the new value is **not equal** to the old one (`Object.is` by default). For objects or arrays, pass `equal` so recomputing "the same" content doesn't ripple through the graph.

`page.ts` counts how often each `computed` recomputes (`runs`), so you can *watch* the graph.

## Your tasks: `page.ts` TODO 1–3

## Senior notes
- Equality matters for **effects** and expensive computeds. A new array with the same ids would otherwise re-render a 1,000-row list.
- Never write to a signal inside a `computed`. Computeds must be pure (Angular throws NG0600 if you try).
