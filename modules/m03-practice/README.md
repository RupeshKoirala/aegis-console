# M03 · Practice project: blocklist capacity planner (built twice)

📖 **Read first (Study Hub):** `angular/l17` forms · `angular/l18` putting it together · `angular-manual/m9` component communication · `m15` forms, three generations

Inline enforcement appliances hold a limited number of blocklist entries. Before a customer onboards three new feeds, someone has to answer: *"When do we run out of room?"* You'll build the planner a sales engineer would use, **twice**:

| # | Version | Uses |
|---|---|---|
| 01 | Gen 3 (v22) | signals, `model`/two-way binding to signals, a signal service, `computed`, pipes |
| 02 | Gen 1 | plain fields, `@Input`/`@Output`/`EventEmitter`, parent-held state, Eager change detection |

Building the same app both ways is the fastest way to *feel* why Angular moved to signals, and to be ready for both kinds of codebase.

The UI is about 70% done in both. You do the data flow.
