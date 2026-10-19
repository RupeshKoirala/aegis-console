# M08 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m08.svg`. Every purple arrow is one step of the injector walk. Before coding, predict which instance each counter will get.

## 🔍 1 · Observe (10 min)
1. **M08 → 01**. Angular DevTools → select a counter → **Injector Tree**. The highlighted path is the walk; the injector that holds `CounterService` is where it stopped. Compare a Shared and an Isolated counter.
2. Each counter shows `#id`. Logpoint in `CounterService`'s constructor (`'new CounterService'`) and reload: count instances. Does it match your prediction?
3. **M08 → 04**. Breakpoint in `EnrichmentService` where `inject(ENRICHERS)` returns. Inspect the array: one entry per `multi: true` provider, in provider order.

## 💥 2 · Break it on purpose (5 min)
1. Remove `providers: [CounterService]` from the **page**. Read **NG0201 No provider for CounterService**. Read the path it prints. Undo.
2. Call `inject(RootCounter)` inside a method instead of a field. Read **NG0203**. Undo.
3. Make two services inject each other. Read **NG0200** (circular dependency). Undo.

## 🐞 3 · Bug hunt + git: `rebase` onto an updated base
**Symptom:** *"Tenant A and Tenant B counters on M08 → 01 should be independent. Now they count together, and they show the same #id as the Edge FW counters."*

```bash
git fetch origin
git switch -c fix/m08 origin/bug/m08-injector
```
Tools: Injector Tree on each counter (who provides `CounterService` now?).

Commit your fix. Meanwhile a teammate pushed a commit on top of the base: `origin/bug/m08-injector-update`. Bring your branch up to date **without** a merge commit:
```bash
git log --oneline --graph origin/bug/m08-injector-update fix/m08      # see the fork
git rebase origin/bug/m08-injector-update
git log --oneline --graph -5                                            # one straight line now
git push -u origin fix/m08
gh pr create --base bug/m08-injector-update --fill
```
If you had already pushed `fix/m08` before rebasing: `git push --force-with-lease` (never plain `--force` on shared branches).
