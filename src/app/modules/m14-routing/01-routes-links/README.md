# M14.01 · Routes, links & the outlet  ⏱ 35 min

The console has sections, and each section is a URL you can bookmark and share with a colleague ("look at /alerts"). This exercise is mounted at `/m14/01`, and **your** routes are its children.

```ts
{ path: '', redirectTo: 'overview', pathMatch: 'full' },   // without 'full', '' is a prefix of EVERY url
{ path: 'lists', component: Lists, title: 'Lists' },
{ path: '**', component: NotFound },                        // last: first match wins
```
```html
<a routerLink="lists" routerLinkActive="active" ariaCurrentWhenActive="page">Lists</a>
<router-outlet />
```
`routerLink="lists"` is **relative** to the current route, which is why the same component works wherever it's mounted.

## Your tasks
- `routes.ts` TODO 1
- `page.ts` TODO 2–3

## Senior notes
- `href` vs `routerLink`: `href` asks the server for a new document (full reload, state lost). `routerLink` pushes history and swaps components. Both render a real `<a href>`, so ctrl-click and "copy link" still work.
- Deep links need the **server** to answer every path with `index.html` (the SPA fallback). `ng serve` does it. nginx/CloudFront need `try_files` / a custom 404 rule. This comes back in the AWS series.
- `routerLinkActive` matches by prefix by default. Use `[routerLinkActiveOptions]="{ exact: true }"` for the home link.
- Gen 1: `RouterModule.forRoot(routes)` in AppModule and `RouterModule.forChild` in feature modules. Gen 2+: `provideRouter(routes, withComponentInputBinding(), …)`. Gen 3 adds `withViewTransitions()` and the router's `currentNavigation()` signal.
