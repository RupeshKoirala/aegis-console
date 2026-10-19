# M09 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m09.svg`. For each component, say what makes it re-render: a new input reference, an event inside it, a signal it reads, or a manual `markForCheck`.

## 🔍 1 · Observe (15 min)
1. **M09 → 02**. Angular DevTools → **Profiler** → record 3 seconds of the ticker → stop. Click a bar: the flame chart shows which components were checked. Switch the rows to OnPush (or back) and record again. Compare bar heights.
2. **M09 → 01**. Add `ngDoCheck() {}` to `AlertCard` with a logpoint inside. Click buttons on the page: does the card get checked?
3. **M09 → 04**. In the console: `typeof Zone`. `'undefined'`: this app is zoneless. Then the only render triggers are signals, events in templates, `markForCheck`, and the async pipe.

## 💥 2 · Break it on purpose (5 min)
1. In `FeedHealth` replace a signal with a plain field updated in `setInterval`. The UI freezes (zoneless: nobody schedules a render). Undo.
2. In `ThrottledCounter` call `detectChanges()` after `detach()` only every 10th tick and watch the update rate. Undo.
3. Inside a template expression, write to a signal (e.g. via a method that calls `.set`). Read **NG0600**. Undo.

## 🐞 3 · Bug hunt + git: `rebase -i` (squash)
**Symptom:** *"On M09 → 01, clicking Resolve doesn't update the alert card. It still says OPEN, yet a breakpoint shows `status` IS 'RESOLVED' in memory."*

```bash
git fetch origin
git switch -c fix/m09 origin/bug/m09-onpush
```
Tools: `ng.getComponent($0).alert()` on the card vs `ng.getComponent(…page…).alert`: same object? Profiler: is the card checked on Resolve?

**Git drill:** make your fix in **four** small commits on purpose (`wip 1` … `wip 4`: the fix, a comment, a typo fix, a test tweak). Then clean up before pushing:
```bash
git rebase -i HEAD~4
# keep the first line as "pick", change the others to "fixup" (or "squash" to keep their messages)
# save; then reword the result:
git commit --amend -m "Alert demo: replace the alert object so OnPush sees a new input"
git log --oneline -3
```
Push, PR into `bug/m09-onpush`.
