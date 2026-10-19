# Git track

You already know the concepts. This track makes them **muscle memory** by using one new command per module, on real code, inside the module's bug hunt (`LAB.md` → drill 3).

## Branches in this repo

| Branch | What it holds | You… |
|---|---|---|
| `main` | starter code (TODOs) | branch your work from it |
| `solutions` | finished code | peek **after** trying (`git diff main origin/solutions -- <path>`) |
| `bug/mNN-<slug>` | `solutions` + one realistic seeded bug (a few modules have more history to dig through) | fix it on a `fix/mNN` branch, open a PR **into the bug branch** |
| `work` (yours) | your own solutions, pass 1 | create it once: `git switch -c work main` and push it |
| `pass1/mNN` (yours) | backups made by `npm run redo` for your second pass | compare passes |

PRs from `fix/*` into `bug/*` keep each drill self-contained: your `work` branch and `main` are never touched by a bug hunt.

## The bug-hunt loop (every module)
```bash
git fetch origin                                   # bug branches appear as origin/bug/...
git switch -c fix/m01 origin/bug/m01-watchlist     # your branch, starting at the bug
npm start                                          # reproduce the symptom from LAB.md
# …debug with the tool LAB.md names, fix the smallest thing…
npm run ex -- m01                                  # the module's tests are your oracle
git add -p && git commit                           # message: what was wrong and why (see M01)
git push -u origin fix/m01
gh pr create --base bug/m01-watchlist --fill       # or open it on github.com
```
When you're done: merge your PR (on GitHub or `gh pr merge`), then `git switch work`.
The bug branches are rebuilt from `solutions` by the course author, so never base your own work on them.

## One new skill per module

| Module | Skill | The drill |
|---|---|---|
| M00 | `switch -c`, `push -u`, `gh pr create` | the loop above, the first time |
| M01 | `commit --amend`, good messages | amend your fix commit with a better message before pushing |
| M02 | `restore`, `diff --staged` | stage two files, unstage one, review exactly what you're committing |
| M03 | `stash` | park half-done work to check the bug branch, then `stash pop` |
| M04 | **`bisect`** | the bug branch has 12 commits; find the one that broke the verdicts |
| M05 | `log -S` (pickaxe), `blame` | find the commit that introduced a line by its content |
| M06 | `cherry-pick` | take only the fix commit onto your `work` branch |
| M07 | `revert` | undo a pushed commit safely (no history rewrite) |
| M08 | `rebase` | rebase your fix branch onto an updated base |
| M09 | `rebase -i` (squash/fixup) | turn four "wip" commits into one clean commit |
| M10 | `worktree` | keep `solutions` checked out next to your work, no stashing |
| M11 | `reflog` | "lose" a commit with `reset --hard`, then rescue it |
| M12 | conflict resolution | two branches change the same interceptor; merge them |
| M13 | `add -p` | commit the validator fix and the unrelated formatting separately |
| M14 | tags | tag your module milestones, push tags |
| M15 | `.gitignore`, leaked secrets | a token got committed: remove it, rotate it, understand why history still has it |
| M16 | `diff --stat`, `--word-diff`, `-w` | review a big diff quickly |
| M17 | `range-diff` | compare two versions of the same branch after a rebase |
| M18 | `merge --no-ff` vs squash merge | see both shapes in `log --graph` |
| M19 | submodules vs packages | discussion + a read-only look |
| M20 | `bisect run` | let a test command find the bad commit for you |
| M21 | `log -L` | the history of one function |
| M22 | pre-commit hook | block `debugger;` and `fit(`/`.only(` before they reach a commit |
| M23 | release branch + hotfix | `release/1.0`, hotfix, merge back, tag |
| M24 | `blame -w -C -C` | see through whitespace changes and moved code |
| M25 | `gh` CLI | issues, PR review comments, checks from the terminal |
| M26 | signed commits, protected branches | concept + repo settings |
| M27 | full PR review loop | open, review, request changes, fix up, squash-merge |

## Handy aliases (optional)
```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 --stat"
```
