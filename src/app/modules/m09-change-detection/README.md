# M09 · Change detection

📖 **Read first (Study Hub):** `angular-manual/m8` change detection · `foundations/l17` how browsers render · `foundations/l7` the event loop

![M09 map: components, services and data flow](../../../../public/diagrams/m09.svg)

🧪 **After the exercises: [LAB.md](LAB.md)**: observe it in a debugger · break it on purpose · fix a seeded bug on a branch with one new git skill.

**Change detection (CD)** is Angular walking the component tree, re-evaluating template bindings and patching the DOM where values changed. What decides *when* it runs and *which* components it visits has changed across all three generations:

| Gen | Trigger | Which components | Default strategy |
|---|---|---|---|
| 1 · v2–v15 | **zone.js** patches every async API (clicks, timers, XHR, promises) and runs CD after each one | **all** (Default/Eager) unless marked OnPush | Default |
| 2 · v16–v20 | zone.js, plus signals mark exactly the components that read them | OnPush components are skipped unless dirty | Default |
| 3 · v21–v22 | **zoneless**: CD runs only when something tells Angular (a signal change, a template event, `markForCheck`, an `async` pipe emission, `setInput`) | **OnPush by default** in v22 | OnPush |

An **OnPush** component is checked only when:
1. an `input` changed **by reference**,
2. an event fired in its template (or a host listener),
3. a **signal** it reads changed,
4. someone called `markForCheck()` (the `async` pipe does this for you).

| # | Exercise | You practise |
|---|---|---|
| 01 | Why is the card stale? | mutation vs new references, plain fields vs signals under OnPush |
| 02 | Measure the render cost | Eager vs OnPush on a 200-row live table |
| 03 | ChangeDetectorRef | `markForCheck`, `detach()` + `detectChanges()` throttling (Gen 1/2 tools) |
| 04 | Zoneless audit | timers / promises / manual listeners that silently stop rendering without zone.js |
