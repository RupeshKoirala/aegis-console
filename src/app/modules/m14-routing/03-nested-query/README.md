# M14.03 · Nested routes & query params  ⏱ 45 min

A list has **tabs**: `/lists/3/indicators` and `/lists/3/about`. The shell (title + tabs) stays on screen while the tab content swaps. That's a route with `children`, and the shell holds its own `<router-outlet>`.

Filters belong in the **URL** (`?q=phish&type=DOMAIN`). Then a reload keeps them, the back button works, and an analyst can paste the exact view into the incident ticket.

```ts
this.router.navigate([], {
  relativeTo: this.route,
  queryParams: { q: value || null },     // null removes the param
  queryParamsHandling: 'merge',          // keep ?type=…
  replaceUrl: true,                      // typing shouldn't create 20 history entries
});
```

## Your tasks
- `routes.ts` TODO 1
- `list-shell.ts` TODO 2–3

## Senior notes
- **URL as state**: anything a user would want to share or bookmark (filters, sort, page, selected tab) goes in the URL. Ephemeral UI (a hover, an open dropdown) doesn't.
- Child routes don't see parent params through input binding by default. Options: read `route.parent` (done for you here), set `paramsInheritanceStrategy: 'always'` app-wide, or have the shell pass data to the child through a service.
- **Input binding gotcha:** a param that's *absent* is bound as `undefined`, and that overrides the input's default. Use `input('', { transform: v => v ?? '' })` (or type the input as `string | undefined`).
- `queryParamsHandling="preserve"` on the tab link keeps the filter when you switch tabs and come back.
- Gen 1: `route.queryParamMap.subscribe(...)` plus manual unsubscribe. Gen 3: query params are inputs, and filtering is a `computed`.
