# M16 · Lazy loading & `@defer`

📖 **Read first (Study Hub):** `angular-manual/m5` control flow and `@defer` · `angular-manual/m16` rendering & performance · `foundations/l17` how browsers render pages

M14.06 split the app **per route**. This module splits **inside a page**: heavy widgets download when they're needed (scrolled to, clicked, idle time, a condition) instead of with the first paint.

| # | Exercise | You practise |
|---|---|---|
| 01 | `@defer` triggers | `on idle / viewport / interaction`, `prefetch on hover`, `@placeholder` / `@loading` / `@error` with timing options |
| 02 | Conditions, lists, timers | `when`, per-row `@defer` inside `@for`, `on timer` |

### Generations
- **Gen 1 (v2–v16):** lazy loading only at route level (`loadChildren`), or by hand: `import()` + `ComponentFactoryResolver` / `ViewContainerRef`.
- **Gen 2 (v17–v19):** `@defer` blocks with triggers and sub-blocks.
- **Gen 3 (v20–v22):** stable incremental hydration (`hydrate on …`) for SSR apps (M23), and `@defer` everywhere it makes sense.
