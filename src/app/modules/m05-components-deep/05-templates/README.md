# M05.05 · `ng-template` & `ngTemplateOutlet`  ⏱ 45 min

A generic **smart table**. It owns looping, empty states and layout, while the *consumer* decides how each row looks by passing a **template**. Data tables, select boxes, virtual lists and "render props" in other frameworks all use this pattern.

## Concepts
```html
<!-- consumer: define a template. Nothing renders yet. let-ind = $implicit, let-i="index" = a named context field -->
<ng-template #indicatorRow let-ind let-i="index">
  <tr><td>{{ i + 1 }}</td><td>{{ ind.value }}</td></tr>
</ng-template>
<aegis-smart-table [rows]="indicators" [rowTemplate]="indicatorRow" />

<!-- inside the table: stamp it out with a context object -->
<ng-container *ngTemplateOutlet="tpl; context: { $implicit: row, index: i }" />
<ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ … }" />     <!-- same, unsugared -->
```
`TemplateRef` is a *blueprint*. It renders **only when and where** an outlet instantiates it, which is the big difference from `ng-content` (M05.02), where the parent always creates the content.

## Your tasks: `smart-table.html` TODO 1–3, `page.html` TODO 4–5

## Senior notes
- Type your contexts: `TemplateRef<RowContext<T>>`. For full template type-checking, a directive can declare `static ngTemplateContextGuard(dir, ctx): ctx is RowContext<T>`.
- Prefer a template input over a pile of boolean inputs (`showIcon`, `showScore`, `compact`…). It scales better.
- Templates capture the scope **where they are declared**. A row template can call the *page's* methods, not the table's.
