# M17.02 · A configurable dashboard  ⏱ 45 min

Each analyst arranges their own dashboard, and the layout is **data**:
```json
[{ "type": "stat", "inputs": { "label": "Blocks today", "value": "1,204" } }, { "type": "top-iocs", "inputs": { "limit": 3 } }]
```
The template can't hard-code `<aegis-stat-widget>`, because it doesn't know what's coming. So:
1. a **registry** maps type → lazy loader (`() => import('./widgets/stat-widget')`)
2. `resolveLayout` loads what the layout needs, in parallel
3. `NgComponentOutlet` renders a component *type* held in a variable:
```html
<ng-container *ngComponentOutlet="w.component; inputs: w.inputs" />
```

## Your tasks: `registry.ts` TODO 1–2, `page.ts` TODO 3

## Senior notes
- **Validate config from the server.** An unknown type renders a visible fallback instead of crashing the dashboard. Inputs from config are untrusted too: widgets must not pass them to `innerHTML`.
- `NgComponentOutlet` vs `ViewContainerRef.createComponent` (01): the outlet is declarative (template-driven, inputs diffed for you). `createComponent` is imperative (full control, outputs, ordering).
- The registry is a **plugin** boundary: product teams can add widgets without touching the dashboard. This is the same pattern as Angular Elements (M19) and micro-frontends.
- **Gen 1:** `ngComponentOutlet` (v4+) had no inputs, so people used a wrapper with `@Input` setters or `ComponentFactoryResolver`. **Gen 2:** `ngComponentOutletInputs` (v16.2). **Gen 3:** the same + `resource()` for the async loading, + `@defer` when the set of widgets is static.
