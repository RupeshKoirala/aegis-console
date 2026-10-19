# M05 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m05.svg`: six exercises, six ways a component reaches outside its own template. Pick two boxes and explain the arrow between them.

## 🔍 1 · Observe (10 min)
1. **M05 → 03**. Elements: inspect `<aegis-severity-badge>`. Find the `_nghost-…` attribute on the host and `_ngcontent-…` on its children. Open its `<style>` in `<head>`: every selector has `[_ngcontent-…]` appended. Now inspect `<aegis-shadow-badge>`: a real `#shadow-root`.
2. **M05 → 04**. Logpoints in each lifecycle hook of `HookProbe` (`'init'`, `'afterNextRender'`, `'destroy'`). Toggle it on and off and read the order. Compare with the LifecycleLog on the page.
3. **M05 → 05**. Elements → select a cell rendered from your `ng-template` → `ng.getContext($0)`: the `$implicit` row and the other context fields you passed in.

## 💥 2 · Break it on purpose (5 min)
1. In `Panel` remove the `select` from one `<ng-content>`. Projected content moves to the default slot. Watch it happen in Elements.
2. Use `viewChild.required` for a ref that is inside an `@if` that's false. Read **NG0951** (required query has no result). Undo.
3. In `StatTile` add `host: { '[class]': '"x"' }` and also bind `[class]` from the page. Which wins? Check Elements. Undo.

## 🐞 3 · Bug hunt + git: `log -S` (pickaxe) and `blame`
**Symptom:** *"On M05 → 06, adding a tag shows a new chip, but 'Parent sees:' doesn't change until you remove something."*

```bash
git fetch origin
git switch -c fix/m05 origin/bug/m05-tags
```
Tools: Angular DevTools on the page shows `labels`. Is it the same array as before (compare in the console)? Breakpoint in the parent's `summary` computed: does it re-run when you add?

**Git drill: find WHEN and WHY it changed, without reading the whole history:**
```bash
git log --oneline -5                                              # the newest commits aren't it
git log -S "this.tags().push" --oneline                           # the commit that ADDED that text
git show <sha>                                                    # read its message: what was the intent?
git blame -L 20,30 src/app/modules/m05-components-deep/06-queries-two-way/tag-input.ts
```
`-S` finds commits that change how often a string appears; `-G` takes a regex. Fix so the intent (simple code) and correctness (a new array) both hold, commit, push, PR into `bug/m05-tags`.
