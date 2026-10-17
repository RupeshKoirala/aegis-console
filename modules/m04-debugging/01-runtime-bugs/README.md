# M04.01 · Hunt the runtime bugs  ⏱ 45 min

`page.ts` and `page.html` contain **4 bugs**. The page is an alert summary: alerts grouped by severity, a "most recent first" list, a detail panel, and paging (3 per page).

Symptoms you'll see when you open `/m04/01`:
1. The console shows an `NG0955` warning, and rows sometimes show the wrong data after paging.
2. Clicking **Clear selection** crashes the page (`TypeError: Cannot read properties of null`).
3. After you visit the page, the original alert order in `ALERTS` is changed (look at M01.05, whose list is now in the wrong order!).
4. The last page is never reachable.

Find each one using the toolkit in the module README. Don't fix by guessing: **reproduce it, locate it, explain it, then fix it**. Then write one sentence per bug in `BUGS.md` (root-cause notes like this are what seniors write in PR descriptions).

## Senior notes
- `NG0955` (duplicate keys in `@for`) is a *warning*, not an error. Production builds don't show it, which is exactly why it ships.
- `Array.prototype.sort()` sorts **in place**. Inside a `computed()` that means you're mutating state you don't own. Use `toSorted()` (ES2023) or `[...arr].sort()`.
- A crash in one template expression breaks the whole component's rendering. Template null-safety (`@if (x(); as x)`, `?.`) is not cosmetic.
