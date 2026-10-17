# M01.05 · Reading (and writing) legacy templates  ⏱ 40 min

Most Angular code at real companies was written before 2024. On day one you'll open templates full of `*ngIf`, `*ngFor` and `[ngClass]`. In this exercise you **write** the **alerts queue** in pure Gen 1 style, so that reading it later is effortless.

## Concepts (Gen 1 · v2–v16, still supported in v22 but deprecated)
```html
<ng-container *ngIf="items.length; else empty">…</ng-container>   <!-- ng-container renders no element -->
<ng-template #empty><p>Nothing</p></ng-template>                   <!-- a template that is only rendered on demand -->

<tr *ngFor="let a of items; let i = index; let odd = odd; trackBy: trackById">
<td [ngSwitch]="a.status"><span *ngSwitchCase="'NEW'">🆕</span><span *ngSwitchDefault>…</span></td>
<tr [ngClass]="{ odd: odd, resolved: a.status === 'RESOLVED' }">    <!-- object form -->
<span [ngClass]="['sev', a.severity]">                             <!-- array form -->
<span [ngStyle]="{ 'background-color': colors[a.status] }">
<p *ngIf="selected as s">{{ s.title }}</p>                          <!-- "as" alias -->
```
**The star (`*`)** is syntactic sugar. `*ngIf="x"` really means `<ng-template [ngIf]="x"><div>…</div></ng-template>`. You'll build your own star directive in M06.

Each directive must be imported (`NgIf`, `NgForOf`, …, or the whole `CommonModule`). The class here also uses plain fields and a getter instead of signals, which is the Gen 1 way.

## Your tasks
- `page.ts`: TODO 1. Import the directives.
- `page.html`: TODO 2–7. One legacy feature each.

## Check
`npm run ex -- m01/05`, then try the status filter buttons in the app.

## Senior notes
- `[ngClass]` / `[ngStyle]` aren't deprecated, but plain `[class.x]` / `[style.x]` bindings are preferred now: they're faster and need no import.
- Migrating Gen 1 to Gen 3 is mostly automated: `ng generate @angular/core:control-flow`, `…:signal-input-migration`, `…:output-migration`, `…:inject`. Know they exist, and always review the diff.
- A `*ngFor` without `trackBy` re-creates every row when the array reference changes, which is a classic jank source in old dashboards. `@for` made `track` mandatory for exactly this reason.
