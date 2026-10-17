# M14.06 · Lazy loading & preloading  ⏱ 40 min

Most analysts never open **Admin**, so they shouldn't download it. A dynamic `import()` in a route makes the bundler split it into its own chunk, which is fetched the first time someone navigates there.

```ts
{ path: 'admin',   loadChildren: () => import('./admin/admin.routes') },   // a whole route subtree
{ path: 'reports', loadComponent: () => import('./reports') },            // one standalone component
```
With `export default`, the `.then(m => m.AdminRoutes)` isn't needed.

**Preloading** downloads lazy chunks in the background *after* the app is idle. Navigation then feels instant without bloating the first load:
```ts
provideRouter(routes, withPreloading(PreloadAllModules))     // everything
provideRouter(routes, withPreloading(OptInPreloading))       // yours: only data.preload, and never on save-data
```
The strategy is app-wide (set in `app.config.ts`), which is why this exercise tests yours in isolation.

## Your tasks
- `routes.ts` TODO 1
- `preloading.ts` TODO 2

Then run `npx ng build` and find `admin.routes`/`audit-log`/`reports` in the list of **lazy chunk files**. Open `/m14/06` with DevTools → Network, and click through.

## Senior notes
- **One static import ruins it.** If anything in the main bundle imports `./reports` normally, the chunk merges back. Check the build output after refactors.
- Lazy chunk + `canMatch` = the code isn't even downloaded for users who can't use it. `canActivate` runs *after* download.
- Gen 1: `loadChildren: './admin/admin.module#AdminModule'` (a string!) → `() => import(...).then(m => m.AdminModule)`. Gen 2: `loadComponent` for standalone (v14+). Gen 3: the same, plus `@defer` (M16) for lazy pieces *inside* a page.
- Chunk names are content-hashed, so a deploy invalidates exactly what changed. Users with an old tab open can hit `ChunkLoadError` after a deploy. Handle it with a reload prompt (M24).
