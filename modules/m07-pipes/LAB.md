# M07 Lab · see it, break it, hunt it

🗺 **Map:** `public/diagrams/m07.svg`. Every `|` in a template is an arrow into a pipe box. The 03 group is the one to really understand: the pipe's input reference is its cache key.

## 🔍 1 · Observe (10 min)
1. **M07 → 03**. Logpoint in `SortByPipe.transform`: `'pure', items.length`, and another in the impure one. Click each button and the "Unrelated click". Fill this table from your console:

   | Button | pure runs? | impure runs? |
   |---|---|---|
   | Add (push, mutable) | | |
   | Add (new array) | | |
   | Unrelated click | | |
2. **M07 → 01**. Breakpoint inside a custom pipe from 02 (e.g. `DefangPipe.transform`), then look at the Call Stack: the frame below yours is the compiled template calling `ɵɵpipeBind1`. A pipe really is just a function call the compiler wrote for you.

## 💥 2 · Break it on purpose (5 min)
1. Use `| defangg`. Read **NG8004**. Undo.
2. Call a pipe with a wrong argument type (`| cidrSize:42` if it expects none). Read the TS error in the template. Undo.
3. Make `RelativeTimePipe` impure and add a logpoint: count runs per click. That's the cost of `pure: false`. Undo.

## 🐞 3 · Bug hunt + git: `revert`
**Symptom:** *"The pure vs impure demo stopped making sense: after 'Add (push, mutable)' the PURE list updates too. Also, the order of `items` changes by itself."*

```bash
git fetch origin
git switch -c fix/m07 origin/bug/m07-sort
```
Tools: in the console, keep a reference before clicking (`a = ng.getComponent($0).items` on the page host), click, then compare order. A pipe must **never** change its input.

**Git drill:** the bad commit was already pushed and others may have pulled it, so don't rewrite history. Undo it with a new commit:
```bash
git log --oneline -4                                 # spot the "perf(sortBy)" commit
git revert <sha>                                     # creates "Revert …" with the inverse change
git show --stat HEAD
npm run ex -- m07/03
```
Edit the revert message (`git commit --amend`) to say *why*: "sorting in place mutates the pipe's input". Push, PR into `bug/m07-sort`.
