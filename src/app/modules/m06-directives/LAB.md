# M06 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m06.svg`. Directives never own a template; they attach. For each directive on the map, name the element it attaches to.

## 🔍 1 · Observe (10 min)
1. **M06 → 04**. Select an `aegis-indicator-chip` in Angular DevTools: the component and its host directives (`Tooltip`, `Focusable`) all show on the **same** node. In the console: `ng.getDirectives($0)`.
2. **M06 → 03**. Elements: find `<!--container-->` comment nodes next to the Delete buttons. That's the anchor a `ViewContainerRef` inserts views next to. Switch roles and watch the DOM change under it.
3. **M06 → 02**. Breakpoint in `CopyDirective`'s click handler; click Copy and inspect `this` in Scope: the directive instance the template reached through `#c="aegisCopy"`.

## 💥 2 · Break it on purpose (5 min)
1. Use `#c="aegisCopyy"` (typo). Read **NG0301** (export not found). Undo.
2. Put two structural directives on one element: `*ngIf` and `*aegisHasRole`. Read the error and remember the fix (`<ng-container>`). Undo.
3. In `IndicatorChip` remove `inputs: ['aegisTooltip: tip']` from `hostDirectives`. Read **NG8002** on `[tip]`. Undo.

## 🐞 3 · Bug hunt + git: `cherry-pick`
**Symptom:** *"On M06 → 03, switch ADMIN → READ_ONLY → ADMIN a few times: rows show Delete AND 'read only' at once, and buttons pile up."*

```bash
git fetch origin
git switch -c fix/m06 origin/bug/m06-has-role
```
Tools: Elements (count the nodes next to the comment anchor after every switch), and a logpoint in the directive's `effect` printing `next` and `this.rendered`.

Fix, commit, push, PR into `bug/m06-has-role`. Then the git drill: you want **only the fix** on your own `work` branch, not the whole bug branch.
```bash
git log --oneline -1                 # copy the sha of your fix
git switch work
git cherry-pick <sha>                # applies just that commit
git log --oneline -3
```
If your `work` copy of the file differs, cherry-pick stops with a conflict: resolve, `git add`, `git cherry-pick --continue` (or `--abort`).
