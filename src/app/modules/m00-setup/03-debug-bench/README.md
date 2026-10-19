# M00.03 · Your debugging bench  ⏱ 60 min

From now on, every module has a `LAB.md` that asks you to **see** the concept in a debugger before and after you code it. This exercise sets up the bench once and teaches you each tool on a page with **two planted bugs**.

> The rule for this exercise: **don't read `page.ts` looking for the bugs.** Let the tools lead you to the line. Reading code is the slow way; you'll need the fast way when the codebase is 300k lines.

## 1 · Install (10 min)

| Tool | Get it | What it's for |
|---|---|---|
| **Angular DevTools** | Chrome Web Store → search "Angular DevTools" (publisher: angular.dev / Google) | component tree, live inputs/signals, injector tree, router tree, change-detection profiler |
| **Chrome DevTools** | built in: `F12` / `Cmd+Opt+I` | breakpoints in your `.ts` files (source maps), logpoints, Network, Elements, Console |
| **WebStorm debugger** | built in | breakpoints in the IDE, for the app *and* for tests |
| **VS Code** (if you use it) | built in | `.vscode/launch.json` already has configs |

After installing, run `npm start`, open http://localhost:4200/m00/03, open DevTools: you should see an **Angular** tab. (No tab? Reload the page once with DevTools open.)

## 2 · Angular DevTools: find bug 1 (15 min)

Symptom: Globex Health has score 82, and anything ≥ 80 is supposed to be **HIGH**. It shows MEDIUM.

1. **Angular tab → Components.** You see the tree `app-root → app-m00-03 → aegis-risk-gauge ×3`. This tree is exactly what the module map (🗺 Map in the sidebar) draws.
2. Click the third `aegis-risk-gauge`. On the right, **Properties** show: `name`, `score` (inputs), `level` (computed) and `thresholds`. Read `thresholds`. Is that what `RISK_THRESHOLDS` in `risk.ts` defaults to?
3. Something gave this gauge a *different* value. Switch the right panel to **Injector Tree** (or the "Injector" section): it shows which injector provided `RISK_THRESHOLDS`. It's not the root default.
4. Now open that file at that spot. *That* is your bug. Fix it.
5. Bonus, live editing: in the Properties panel, double-click `score` on a gauge and type 95. Inputs are read-only for the component, but DevTools lets you poke them to try "what if" quickly.

**Console API, the same information without the extension.** In the Elements tab, click a `<aegis-risk-gauge>` node, then in the Console:
```js
ng.getComponent($0)            // the component instance of the selected element
ng.getComponent($0).thresholds // read any property
ng.getOwningComponent($0)      // the component whose template contains this element
ng.getInjector($0)             // the element's injector
ng.getDirectives($0)           // directives on the element (M06)
```
`$0` is "the element currently selected in Elements". These `ng.*` helpers exist in dev builds only.

## 3 · Chrome DevTools Sources: find bug 2 (15 min)

Symptom: click **Rescan +10** on Acme Schools. The row changes to 45, the counter goes up… but **Average risk** stays 57.

1. **Sources** tab → `Cmd/Ctrl+P` → type `page.ts` → pick the one under `m00-setup/03-debug-bench`. Source maps let you debug the TypeScript you wrote, not the compiled bundle.
2. Click the line number inside `rescan()` to set a **breakpoint**. Click Rescan. Execution pauses.
3. Step over with `F10` line by line. Watch the **Scope** panel: what is `t`? Hover `this.tenants()` before and after the update.
4. Set a second breakpoint inside the `average` computed. Click Rescan again. Does it pause? **No.** A `computed` only re-runs when a signal it reads gets a *new value*, and `signal.set(x)` with the *same* array reference counts as "no change" (`Object.is`).
5. Fix `rescan()` so the signal receives a **new** array, using an immutable update. The row only updated before because the click event re-rendered the page; the computed is memoised and never knew.

Three more Sources tricks to try right now:
- **Logpoint**: right-click a line number → *Add logpoint* → `'rescan', id, this.tenants()`. It logs without editing code and without pausing.
- **Conditional breakpoint**: right-click → *Add conditional breakpoint* → `id === 'globex'`.
- **`debugger;`**: type it in your code; DevTools pauses there whenever it's open. Never commit it (M22 adds a hook that blocks it).

## 4 · Profiler (5 min)
Angular tab → **Profiler** → Start → click Rescan three times → Stop. Every bar is one change-detection pass. Click a bar: the flame chart lists which components were checked and how long each took. You'll use this for real in M09.

## 5 · Debugging tests (10 min)
Bugs are faster to catch in a test than in the browser. Your tests run in Node (Vitest + jsdom), so a **Node** debugger is what you need.

**WebStorm**
1. *Run → Edit Configurations → + → npm*. Command `run`, script `ex`, arguments `-- m00/03 --once`.
2. Put a breakpoint in `debug-bench.spec.ts` (click the gutter) and another inside `rescan()` in `page.ts`.
3. Click the **bug** icon (Debug) instead of Run. WebStorm attaches to the child processes automatically and stops in your spec, then in your component.

**For the app in WebStorm:** *+ → JavaScript Debug*, URL `http://localhost:4200`. Start `npm start` first, then Debug this config. Breakpoints in your `.ts` files in the editor now pause Chrome.

**VS Code:** use the **"Debug exercise tests"** launch config (asks for `m00/03`), or open a *JavaScript Debug Terminal* and run `npm run ex -- m00/03 --once`.

## Check
`npm run ex -- m00/03` turns green when both bugs are fixed. Then open `docs/DEBUGGING.md`: the one-page cheat sheet you'll keep next to you for the rest of the course.

## Senior notes
- Pick the tool by the question. "What value does it have *now*?" → Angular DevTools / `ng.getComponent`. "How did it get that value?" → breakpoint + call stack. "How often does this run?" → logpoint or Profiler. "Did the server send it?" → Network.
- A frozen UI with correct data in memory is almost always a **reference** problem (same object/array, so signals, `computed`, OnPush and pure pipes see "no change"). You'll meet it again in M05, M07, M09 and M10.
- Reproduce first, then debug. The fastest reproduction is a failing test: it runs in a second and never forgets the steps.
- Interview question: *"How do you find where a value comes from in an Angular app you don't know?"* Answer with this exercise: component tree → properties → injector tree → breakpoint in the provider → call stack.
