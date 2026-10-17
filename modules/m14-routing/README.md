# M14 · Routing

📖 **Read first (Study Hub):** `angular-manual/m13` routing · `angular/l15` pages & navigation · `foundations/l15` what happens when you type a URL

The console becomes an app with addresses: sections, list pages, tabs, filters in the URL, data loaded before a page shows, role-protected areas, and code that downloads only when needed. Each exercise mounts **its own child routes** under `/m14/0X` (see `module.ts`), the same way a feature area mounts under `/admin` in a real app.

| # | Exercise | You practise |
|---|---|---|
| 01 | Routes, links & the outlet | route config, redirects, `**`, `routerLink`, `routerLinkActive`, `title` |
| 02 | Route params as inputs | `withComponentInputBinding`, `numberAttribute`, the reused-component bug |
| 03 | Nested routes & query params | `children`, nested outlets, URL as state, `queryParamsHandling` |
| 04 | Resolvers & titles | `ResolveFn`, `RedirectCommand`, title resolvers, sharing one request |
| 05 | Guards | `canActivate`, `canMatch`, `canDeactivate`, guard factories |
| 06 | Lazy loading & preloading | `loadChildren`, `loadComponent`, default exports, a custom `PreloadingStrategy` |

### Generations
- **Gen 1:** `RouterModule.forRoot/forChild`, class guards and resolvers (`implements CanActivate`), `ActivatedRoute.snapshot`/`paramMap.subscribe`, `loadChildren` pointing to an NgModule.
- **Gen 2 (v14–v17):** `provideRouter`, functional guards/resolvers, `loadComponent`, `withComponentInputBinding` (v16).
- **Gen 3 (v18–v22):** `RedirectCommand`, params/query/resolved data as **signal inputs**, `currentNavigation()` signal, `withViewTransitions`.
