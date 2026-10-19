# M00 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m00.svg` (also in the app: **M00 → 🗺 Map**). Before coding, trace one arrow on it out loud: "main.ts reads app.config, which boots App, whose outlet shows the page."

Do the exercises first (including **03 · Your debugging bench**, which installs the tools). Then this lab, about 40 min.

## 🔍 1 · Observe (10 min)
1. `npm start`, open **M00 → 01**. Sources → `Cmd/Ctrl+P` → `indicator-utils.ts` → breakpoint on the first line of `classify()`.
2. Type `10.0.0.0/8` in the box. You pause **once per keystroke**. Look at the Call Stack: your function is called from the page's `computed`, which is called from the template. That's the whole data flow of 01 in one panel.
3. Replace the breakpoint with a **logpoint**: `classify`, value, `→`, the return isn't known yet… so put it on the `return` lines instead. Type again and read the console.
4. Angular tab → select `app-m00-02` → expand: you see `aegis-console-header` and both `aegis-tenant-badge`. Compare with the map.

## 💥 2 · Break it on purpose (5 min)
1. In `02-first-components/page.ts` remove `TenantBadge` from `imports`. Read the terminal: **NG8001 'aegis-tenant-badge' is not a known element**. Note: the error names the *template file and line*. Undo.
2. In `indicator-utils.ts` change a return type to something wrong (e.g. return `42` from `label()`). Read the **TS2322** error. Undo.
3. Write `debugger;` in `classify()` and type in the box with DevTools open. Remove it.

## 🐞 3 · Bug hunt + git: branch → push → pull request
**Git skill:** create a branch, push it, open a PR. One-time setup: `gh auth login` (GitHub CLI), or use github.com in the browser.

**Symptom (from a support ticket):** *"Analysts paste `Evil-Domain.COM` from an email and the console says it isn't a valid indicator. Lowercase works."*

```bash
git fetch origin
git switch -c fix/m00 origin/bug/m00-classify
npm start                      # reproduce on M00 → 01 first
```
Use the logpoint from drill 1 to compare what `classify()` receives and what it compares. Fix the smallest thing.
```bash
npm run ex -- m00/01           # green = fixed
git add -A
git commit -m "Classify: compare domains case-insensitively"
git push -u origin fix/m00
gh pr create --base bug/m00-classify --fill
gh pr view --web               # look at your diff on GitHub
```
Done? Merge it (`gh pr merge --merge`) and `git switch work`. Answer key, only after trying: `git diff origin/bug/m00-classify origin/solutions -- src/app/modules/m00-setup`.
