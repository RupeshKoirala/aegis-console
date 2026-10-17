# M06.03 · Structural directive `*aegisHasRole`  ⏱ 50 min

Role-based UI: show *Delete* only to admins, show *Edit* to admins and analysts, show "read-only" to everyone else. You'll write the directive that powers every permission check in the console.
```html
<button *aegisHasRole="'ADMIN'; else readOnly">Delete list</button>
<ng-template #readOnly><span>🔒 read-only</span></ng-template>
<p *aegisHasRole="['ADMIN', 'ANALYST']; let role">You can edit as {{ role }}</p>
```

## How `*` works
`*aegisHasRole="'ADMIN'; else readOnly"` is sugar for:
```html
<ng-template [aegisHasRole]="'ADMIN'" [aegisHasRoleElse]="readOnly"><button>Delete list</button></ng-template>
```
So the directive sits on an `<ng-template>`. It receives a `TemplateRef` (the blueprint) and a `ViewContainerRef` (the spot in the DOM), and decides when to stamp it:
```ts
private readonly tpl = inject(TemplateRef<HasRoleContext>);
private readonly vcr = inject(ViewContainerRef);
this.vcr.clear();
this.vcr.createEmbeddedView(this.tpl, { $implicit: role });   // `let role` reads $implicit
```
Micro-syntax rule: `else readOnly` maps to an input named `<selector>Else`, i.e. `aegisHasRoleElse`.

## Your tasks: `has-role.directive.ts` TODO 1–5, `page.ts` / template TODO 6

## Senior notes
- 🔐 **UI checks are UX, not security.** Hiding the Delete button doesn't stop someone from calling `DELETE /api/v1/lists/2`. The server must enforce roles (the fake API does: try it as `viewer@acme.test` in M15).
- `static ngTemplateContextGuard(dir, ctx): ctx is HasRoleContext` tells the template type-checker what `let role` is. Without it, `role` is `any`.
- Avoid destroying and re-creating views when the outcome didn't change. Remember what you rendered (a "has view" flag) to keep DOM state like focus and input text.
