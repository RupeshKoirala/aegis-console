# M05 · Components deep dive

📖 **Read first (Study Hub):** `angular-manual/m3` components · `m9` component communication · `m10` directives, host bindings & pipes · `angular/l13`

You're building the **dashboard widget kit**: buttons, tiles, panels, tables and tag inputs that the rest of the console reuses. This is where "I can use Angular" becomes "I can design components other people use".

| # | Exercise | You practise |
|---|---|---|
| 01 | Host elements & attribute selectors | `button[aegisBtn]`, `host: {}` bindings/listeners, `@HostBinding/@HostListener` (Gen 1) |
| 02 | Content projection & content queries | multi-slot `ng-content`, fallback content, `ngProjectAs`, `contentChildren()` / `@ContentChildren` |
| 03 | View encapsulation | Emulated vs ShadowDom vs None, `:host`, `:host()`, `:host-context()`, `::ng-deep` |
| 04 | Lifecycle | every hook in order, `DestroyRef`, `afterNextRender` |
| 05 | Templates | `ng-template`, `ngTemplateOutlet` with context, templates as inputs |
| 06 | View queries & two-way binding | `viewChild()` / `viewChildren()`, `model()`, the Gen 1 `x` + `xChange` pair |
