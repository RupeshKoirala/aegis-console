# M01 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m01.svg` (app: **M01 → 🗺 Map**). Blue arrows go down (inputs), green go up (outputs), purple go sideways through a service. Point at each one in the running app.

## 🔍 1 · Observe (10 min)
1. **M01 → 03**. Angular tab → select an `aegis-indicator-card`. Properties show `indicator` as an **input** signal. Edit its `score` in DevTools: the card updates, the page doesn't. Data only flows down.
2. **M01 → 04**. Put a breakpoint inside the page's `(block)` handler. Click Block on a row: the Call Stack shows the row's `output.emit()` → your page method. That's the green arrow.
3. **M01 → 06**. Select `aegis-watchlist-panel` and `aegis-indicator-picker` in turn. Add a logpoint on the first field line of `WatchlistService` (`'service created'`) and reload. **It logs once**: one instance for both. Then Injector Tree: both components resolve it from the root injector.

## 💥 2 · Break it on purpose (5 min)
1. In `03-inputs/page.html` misspell an input: `[indicatr]="i"`. Read **NG8002 Can't bind to 'indicatr'**. Undo.
2. Inside `IndicatorCard`, try `this.indicator.set(…)`. Read the TS error: input signals have no `set`. Undo.
3. In `02-control-flow` change `track i.id` to `track $index`, then reverse the list in DevTools. Nothing breaks visibly, but Elements shows every row being re-created instead of moved. Undo.

## 🐞 3 · Bug hunt + git: `commit --amend` and messages that explain
**Symptom:** *"On the watchlist page (M01 → 06), starring an indicator does nothing to the panel's count. Sometimes the list catches up later, when something else changes."*

```bash
git fetch origin
git switch -c fix/m01 origin/bug/m01-watchlist
```
Hint for the tools: breakpoint in the service's `toggle()`, then step. Compare the array **before** and **after** with `===` in the console.

After fixing, commit with a lazy message on purpose: `git commit -am "fix"`. Now improve it **before pushing**:
```bash
git commit --amend             # the editor opens: write a real message
```
A good message has a subject (what) and a body (why):
```
Watchlist: return a new array from toggle()

Mutating the array in place keeps the same reference, so the signal
sees no change and the panel's computed count never re-runs.
```
Forgot a file? `git add it && git commit --amend --no-edit`. Then push and open the PR into `bug/m01-watchlist` (see M00). Amend only commits you haven't pushed yet.
