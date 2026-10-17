# M14.02 · Route params as inputs  ⏱ 35 min

`/lists/3` should show list 3. Three generations of reading `:listId`:

```ts
// Gen 1: snapshot. BUG: going from /lists/2 to /lists/3 REUSES the component, and the snapshot never updates
this.id = +this.route.snapshot.paramMap.get('listId')!;
// Gen 1/2: observable, correct but noisy
this.list$ = this.route.paramMap.pipe(map(p => +p.get('listId')!), switchMap(id => this.api.list(id)));
// Gen 3: provideRouter(routes, withComponentInputBinding()), and the param is just an input
readonly listId = input.required({ transform: numberAttribute });
```
Input binding also fills query params, `data` and resolver results by name. All of them are signals, so `computed` and `httpResource` react to navigation for free.

## Your tasks
- `routes.ts` TODO 1
- `list-detail.ts` TODO 2

## Senior notes
- The "same component, new param" case is **the** classic routing bug. The test for it checks the instance is reused *and* the view updates.
- Relative links: `[routerLink]="['..', id]"` means a sibling. `'..'` goes up one level. Absolute (`'/lists'`) links break when the feature is mounted elsewhere.
- Param values are **untrusted input**: `/lists/<script>` is a valid URL. Angular escapes interpolation, but never pass params to `innerHTML`, `bypassSecurityTrust*` or a URL you `window.open`.
