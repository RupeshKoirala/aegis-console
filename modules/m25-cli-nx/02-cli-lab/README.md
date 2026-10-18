# M25.02 · CLI, schematics & Nx lab  ⏱ 60–90 min

No tests here: this is terminal work. Open `/m25/02` and tick the steps off as you go. The key ideas:

- **Schematics** are code generators *and* code migrators. `ng generate` scaffolds with your project's conventions. `ng update` runs **migrations** that rewrite your code across a major version.
- **Built-in migrations** move a codebase between generations: `@angular/core:control-flow` (`*ngIf` → `@if`), `:signal-input-migration` (`@Input` → `input()`), `:inject` (constructor → `inject()`), `:standalone` (NgModules → standalone).
- **Workspaces:** one repo, many apps and libraries. The CLI supports `projects/*`. **Nx** adds a project graph, `affected` commands (only build/test what changed), remote caching, and module-boundary rules (M25.01).

## Senior notes
- Upgrade one major at a time (21 → 22 → 23). Read `update.angular.dev` for your from→to pair, run `ng update`, commit, run tests, repeat.
- Dry-run everything first (`--dry-run`). Migrations are code edits, so review the diff like any PR.
- **Gen 1:** `ng generate module` + `declarations` everywhere, `ng update` from v6. **Gen 2:** standalone schematics, application builder (esbuild). **Gen 3:** signal/inject/control-flow migrations, Vitest and Playwright integrations, `ng mcp` for AI-assisted tooling.
