# M02 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m02.svg`. Follow `InitialsPipe` from where it's declared to where it's used: every arrow on the way is a line of NgModule metadata.

## 🔍 1 · Observe (10 min)
1. **M02 → 01**. Angular tab → select `aegis-user-table`. Compare with a component from M01: NgModule-declared components show **no** standalone flag.
2. Elements → select an `<aegis-role-badge>` inside the table → console: `ng.getOwningComponent($0)`. The owner is `UserTableComponent`, even though the badge comes from SharedModule. NgModules decide **visibility** (who may use a tag), not ownership.
3. **M02 → 02**, after your migration: look at the network tab while navigating to it (`ng serve` builds lazy chunks per route). Standalone components make that per-route split easy.

## 💥 2 · Break it on purpose (5 min)
1. Remove `InitialsPipe` from `SharedModule`'s **exports** (keep it in declarations). Read **NG8004 No pipe found with name 'initials'**: declared ≠ visible. Undo.
2. Declare `RoleBadgeComponent` in **both** SharedModule and AdminModule. Read the "declared in multiple NgModules" error. Undo.
3. Add `standalone: false` to a component and import it into a standalone page directly. Read the error. Undo.

## 🐞 3 · Bug hunt + git: `restore`, `diff --staged`
**Symptom:** *"In the admin users table (M02 → 01), the READ ONLY badge says `READ_ONLY`."*

```bash
git fetch origin
git switch -c fix/m02 origin/bug/m02-role-badge
```
Use `ng.getComponent($0)` on the badge to see the raw `role`, then find the expression that formats it.

**Git drill:** while fixing, also make a throwaway change in another file (e.g. a comment in `users.ts`). Then:
```bash
git add -A                     # oops, staged both
git diff --staged              # review exactly what would be committed
git restore --staged src/app/modules/m02-modules/01-ngmodules/users.ts   # unstage the throwaway
git restore src/app/modules/m02-modules/01-ngmodules/users.ts            # and discard it
git diff --staged              # only the fix is left
git commit -m "RoleBadge: show roles with spaces, not API ids"
```
Push and open the PR into `bug/m02-role-badge`.
