# M03 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m03.svg`. Left side: sibling components share a service. Right side: everything goes through the parent. Say which one you'd pick for a 10-component form, and why.

## 🔍 1 · Observe (10 min)
1. **M03 → 01**. Logpoint inside `PlannerService`'s `rows` computed: `'rows recomputed'`. Type one digit in the form. Count the logs.
2. **M03 → 02**. Add `ngOnChanges() {}` to `LegacyResultsTable` and put a logpoint inside it. Click Calculate. Count again.
3. Angular tab → Profiler: record one calculation on each page and compare how many components were checked.

## 💥 2 · Break it on purpose (5 min)
1. In 01, provide `PlannerService` in **both** `PlannerForm` and `ResultsTable` (`providers: [PlannerService]`). The table stops reacting: two instances. Confirm in DevTools → Injector Tree. Undo.
2. In 02, forget to `emit()`. Nothing happens and nothing errors: the quietest kind of bug. Undo.

## 🐞 3 · Bug hunt + git: `stash`
**Symptom:** *"Capacity planner (M03 → 01): with 2,000 additions/day and 10% growth, month 1 already shows growth. Month 1 should be the base rate."*

Start some unrelated work on your `work` branch first (edit any file, don't commit). Then:
```bash
git stash push -m "half-done m03 styling"   # park it
git fetch origin
git switch -c fix/m03 origin/bug/m03-projection
```
`project()` is a pure function: write a 3-line test (or use the existing spec) and put a breakpoint inside the loop. Watch `month` and the exponent on the first iteration.
```bash
npm run ex -- m03/01
git commit -am "Projection: no growth in the first month"
git push -u origin fix/m03 && gh pr create --base bug/m03-projection --fill
git switch work
git stash list
git stash pop                  # your half-done work is back
```
