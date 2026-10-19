# M04 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m04.svg`: which layer catches which bug. This module *is* the debugging module, so the lab adds the most powerful git debugging tool: **bisect**.

## 🔍 1 · Observe (10 min)
1. **M04 → 02**. Put a conditional breakpoint in `decide()`: `query === '203.0.113.7'` (or any value you test with). Type other values: no pause. Type that one: pause. Step through each `if`.
2. While paused, use the Console: it runs **in the paused scope**. Try `matches.map(m => m.score)`.
3. Sources → right panel → enable **Pause on caught exceptions**, then use M04 → 01. Turn it off again.

## 💥 2 · Break it on purpose (5 min)
1. In `verdict-engine.ts` return `undefined as any` from `decide()`. Read the runtime error in the page: which frame points at the template, which at your code? Undo.
2. Change a spec expectation so it fails and read Vitest's diff output (expected vs received). Undo.

## 🐞 3 · Bug hunt + git: `bisect`
**Symptom:** *"A threat whose score is exactly the threshold is allowed. It used to be blocked. Nobody knows when it changed: the branch has a dozen commits."*

```bash
git fetch origin
git switch -c fix/m04 origin/bug/m04-verdicts
git log --oneline origin/solutions..HEAD      # 12 commits since it was last good
git bisect start
git bisect bad                                # HEAD is broken
git bisect good origin/solutions              # this was fine
# git checks out a commit in the middle. Test it:
npm run ex -- m04/02 --once
git bisect good    # or: git bisect bad   (repeat until git names the first bad commit)
git show           # read the culprit
git bisect reset
```
About 4 steps for 12 commits (log₂12). Fix it, then:
```bash
git commit -am "Verdict engine: block threats AT the threshold, not only above it"
git push -u origin fix/m04 && gh pr create --base bug/m04-verdicts --fill
```
M20 shows `git bisect run`, which does the good/bad loop for you.
