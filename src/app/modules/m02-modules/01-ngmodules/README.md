# M02.01 · Build a feature with NgModules  ⏱ 45 min

A "legacy" **tenant admin area**: a user table that uses a role badge and an initials pipe. Everything is `standalone: false` and wired through modules, exactly like a 2019 codebase.

## Concepts
```ts
@NgModule({
  declarations: [RoleBadgeComponent, InitialsPipe],   // things that BELONG to this module (each exactly one module)
  imports: [CommonModule],                             // modules whose EXPORTS my declarations may use
  exports: [RoleBadgeComponent, InitialsPipe],         // what modules that import ME may use
})
export class SharedModule {}
```
**Compilation scope:** a declared component's template can use (1) everything declared in its own module, and (2) everything **exported** by modules its module imports. Nothing else. Forgetting an `export` is the #1 NgModule bug: you'll see `NG8001 'x' is not a known element` even though `x` is clearly declared somewhere.

## Your tasks
1. `shared.module.ts`: TODO 1. Declare **and export** `RoleBadgeComponent` + `InitialsPipe`, and import `CommonModule`.
2. `admin.module.ts`: TODO 2. Declare `UserTableComponent`, import `SharedModule`, export `UserTableComponent`.
3. `user-table.component.html`: TODO 3. Now that the scope is right, use `<aegis-role-badge>` and `| initials`.
4. `page.ts` / `page.html`: TODO 4. A **standalone** page imports the `AdminModule`. That's how the two worlds mix.

## Check
`npm run ex -- m02/01`. Try deleting `exports` from `SharedModule`: the build fails with NG8001. That's the error message you just learned to read.

## Senior notes
- **Feature modules** group a feature; a **SharedModule** exports widely-reused UI; a **CoreModule** holds app-wide singletons, imported once. You'll see all three in older apps.
- A service in a lazy-loaded module's `providers` gets a **separate instance** per lazy module. That's a classic source of "my state reset" bugs (M08).
- `forRoot()` / `forChild()` static methods (RouterModule, NgRx…) exist so that a module provides singletons only once. Read them as "configure + provide".
