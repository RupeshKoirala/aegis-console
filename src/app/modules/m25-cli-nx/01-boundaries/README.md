# M25.01 · Architecture boundaries  ⏱ 35 min

Ten developers, two years, no rules: a `ui` button imports an HTTP service, `feature-lists` reaches into `feature-alerts`, and an import cycle makes the build order random. **Monorepo tooling enforces architecture with tags**:

```jsonc
// Nx: project.json
{ "tags": ["type:feature", "domain:lists"] }
// eslint: @nx/enforce-module-boundaries
{ "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:ui", "type:util"] }
```
| Type | May import | Holds |
|---|---|---|
| `app` | everything below | routes, app config, composition |
| `feature` | ui, data-access, util | smart components, pages |
| `ui` | ui, util | presentational components (inputs/outputs only) |
| `data-access` | data-access, util | services, stores, API clients |
| `util` | util | pure functions, types |

Plus **domains**: lists code doesn't import alerts code, only `shared`.

## Your tasks: `boundaries.ts` TODO 1–2
Then play with `/m25/01`: add illegal imports and watch the rule catch them.

## Senior notes
- Boundaries are what make a large codebase **refactorable**: when `ui` can't depend on `data-access`, a design-system change can't break the API layer.
- Cycles break incremental builds and lazy loading (two chunks needing each other). Nx/madge report them, and so does `hasCycle`.
- This course's own layout (`core/`, `shared/domain/`, `modules/mNN-*`) follows the same idea at small scale.
