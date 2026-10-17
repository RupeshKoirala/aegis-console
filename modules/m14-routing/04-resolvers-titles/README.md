# M14.04 · Resolvers & titles  ⏱ 50 min

Sometimes a page is meaningless without its data: a list page with no list. A **resolver** loads that data **during navigation**, so the component is born with it. A failure becomes a redirect instead of an empty page.

```ts
export const listResolver: ResolveFn<ListView> = (route, state) =>
  inject(ListsApi).get(Number(route.paramMap.get('listId'))).pipe(
    catchError(err => err.status === 404 ? of(new RedirectCommand(notFoundTree)) : throwError(() => err)));

{ path: 'lists/:listId', component: ResolvedList, resolve: { list: listResolver }, title: listTitle }
// ResolvedList: readonly list = input.required<ListView>();   ← bound by key, thanks to input binding
```
`title` can be a string **or** a `ResolveFn<string>`. Titles and resolvers run **in parallel**, so both ask `ListsApi.get(id)`, and the API service must share one in-flight request (TODO 3).

## Your tasks
- `resolvers.ts` TODO 1–2
- `lists-api.ts` TODO 3
- `routes.ts` TODO 4

Try `/m14/04/lists/99` with the API running.

## Senior notes
- **Resolver vs. loading in the component:** a resolver blocks navigation, and the old page stays up (show a progress bar from `router.currentNavigation()`). Loading in the component (`httpResource`) navigates instantly and shows a skeleton. Modern apps prefer the second for anything slow. Use resolvers for small, essential, fast data, and for redirect decisions.
- `RedirectCommand` (v18+) beats returning a `UrlTree` because it carries navigation extras (`skipLocationChange`, `replaceUrl`).
- A cache without invalidation is a bug waiting to happen. Here a list's name rarely changes, but a real `ListsApi` should drop the entry after `PUT`/`DELETE`.
- **Gen 1:** `@Injectable() class ListResolver implements Resolve<ListView>` + `route.data.subscribe(d => this.list = d.list)`. **Gen 3:** a function plus an input.
- Global browser title format ("… · Aegis"): extend `TitleStrategy` and provide it at the root next to `provideRouter`.
