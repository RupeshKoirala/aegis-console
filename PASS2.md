# Pass 2: do it again, without the safety net

Pass 1 teaches you the concepts. Pass 2 turns them into reflexes. Plan it for after you finish M27 (or after every block of ~5 modules, if you prefer spaced repetition).

## Start a module over
```bash
git switch work
npm run redo -- m05            # backs your pass-1 code up to branch pass1/m05, restores the starters
```
Your first attempt is safe: `git diff pass1/m05 -- src/app/modules/m05-*` compares the two passes later.

## The rules for pass 2
1. **Explain the map first.** Open 🗺 Map for the module and explain every arrow out loud (or to a rubber duck) *before* opening any code. If you get stuck on an arrow, that's the lesson to reread.
2. **No READMEs, no hints.** Read only the TODO lines in the code. Open the README only after 10 minutes stuck, and write down what you looked up.
3. **Time-box it.** Note your time per exercise next to pass 1. Seniors are fast because they've done it before; this is how you get "before".
4. **Tests last.** Write the code, run the app, check it in DevTools, *then* run `npm run ex`. Pass 1 leaned on the tests; pass 2 leans on your own verification.
5. **Bug hunts in a different order, and from symptoms only.** Cover the "Hint" lines in `LAB.md`. Pick the tool yourself.
6. **One extra git skill per sitting.** Redo the module's git drill, then one from a later module (e.g. bisect while doing M02).
7. **Compare and keep notes.** `git diff pass1/mNN -- src/app/modules/mNN-*`: is pass 2 simpler? Put one sentence per module in a `NOTES.md` on your `work` branch.

## Track it
| Module | Pass 1 time | Pass 2 time | Looked up | Map explained? |
|---|---|---|---|---|
| M00 | | | | |
| M01 | | | | |
| … | | | | |
