# M00.02 · Your first components  ⏱ 30 min

## Concepts
A component is a **class + template + styles**, joined by the `@Component` decorator. Its **selector** is the custom HTML tag you write to use it.
```ts
@Component({
  selector: 'aegis-tenant-badge',        // <aegis-tenant-badge />
  template: `<span>…</span>`,            // inline template…
  // templateUrl: './tenant-badge.html', // …or a separate file (better for anything over ~10 lines)
  styles: `span { … }`,                  // scoped to this component only (more in M05)
})
export class TenantBadge {}
```
A component can use another component in its template **only if it lists it in `imports`**. Otherwise you get NG8001 *"'x' is not a known element"*.

**What the compiler does (`angular-manual/m2`):** at build time Angular compiles every template into plain JavaScript functions that create and update DOM nodes. It stores the result on a static field of your class, `ɵcmp`. The tests for this exercise read that field. Nothing about it is magic: your class literally gains a compiled template.

> On a real project you'd create components with `npx ng generate component tenant-badge` (`ng g c`). Add `--dry-run` to see what it would create without writing anything.

## Your tasks
1. `console-header.ts`: decorate the class: selector `aegis-console-header`, `templateUrl` and `styleUrl` pointing at the files next to it.
2. `tenant-badge.ts`: decorate it with an **inline** template, selector `aegis-tenant-badge`. The exact HTML is in the TODO.
3. `page.ts`: import both components.
4. `page.html`: render the header once and the badge **twice** (one in the header area, one in the footer).

## Check
`npm run ex -- m00/02`, then open **M00 → 02**.
Bonus: open DevTools → Console and run `ng.getComponent(document.querySelector('aegis-tenant-badge'))`. That's Angular's debugging API, which you'll use a lot in M04.

## Senior notes
- Custom-element selectors need a dash (`aegis-…`). Teams use a project prefix so tags never collide with real HTML or third-party libraries. `angular.json → "prefix"` controls what the CLI generates.
- Interview question: *"What is AOT?"* Ahead-of-time compilation: templates are compiled during the build, so template errors break the build instead of crashing users, and the browser never downloads the Angular compiler.
