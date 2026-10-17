# M05.02 · Content projection & content queries  ⏱ 45 min

A reusable **dashboard panel**. Consumers decide what goes in the title, the body and the footer. The panel decides where it goes, adds a **fallback** footer when the consumer passes none, and counts the action buttons it was given.

## Concepts
```html
<!-- panel.html -->
<header><ng-content select="[panelTitle]" /></header>
<div><ng-content /></div>                                         <!-- default slot -->
<footer><ng-content select="[panelFooter]">Last updated just now</ng-content></footer>  <!-- fallback (v18+) -->

<!-- consumer: ngProjectAs lets a wrapper element "pretend" to match a slot -->
<ng-container ngProjectAs="[panelFooter]"><a>Open report</a></ng-container>
```
**Content queries** let the panel *find* projected components:
```ts
readonly actions = contentChildren(PanelAction);         // Gen 3: a signal of matches
@ContentChildren(PanelAction) actions!: QueryList<PanelAction>;   // Gen 1: ready in ngAfterContentInit
```
**View** = what the component's own template creates. **Content** = what the parent puts between its tags. `viewChild` searches the first, `contentChild` the second (M05.06).

## Your tasks
- `panel.html`: TODO 1–2 · `panel.ts`: TODO 3 · `legacy-panel.ts`: TODO 4 · `page.html`: TODO 5

## Senior notes
- Projected content is **created by the parent**, even when the panel hides it with `@if`. It still exists and its lifecycle hooks still run. To create content lazily, take an `ng-template` instead (M05.05).
- `ng-content` can't be used conditionally twice. Only the first `<ng-content>` for a selector receives the nodes.
- `{ descendants: true }` makes content queries look into nested elements, not just direct children.
