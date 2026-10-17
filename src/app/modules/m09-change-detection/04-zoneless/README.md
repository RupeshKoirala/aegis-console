# M09.04 · Zoneless audit  ⏱ 30 min

This **feed health widget** was written for a zone.js app. After the upgrade to zoneless it looks frozen: three async updates no longer reach the screen, even though the component is set to `Eager`.

Why? `Eager` means "check me **whenever CD runs**", and in a zoneless app nothing *starts* CD after a `setTimeout`, a resolved `Promise`, or a listener added with `addEventListener`. zone.js used to do that for every async callback.

## Your task: migrate the three fields to signals (TODO 1–3 in `feed-health.ts`)
After the fix, remove the `Eager` line too, because it was only there out of habit.

## Senior notes
- Migration checklist for zoneless: search for `setTimeout`, `setInterval`, `.then(`, `addEventListener`, `subscribe(` and third-party callbacks that write component fields. Each one needs a signal, `markForCheck`, or the `async` pipe.
- `provideZonelessChangeDetection()` was the opt-in in v18–v20. In v21+ new apps are zoneless by default, and zone.js isn't even in `polyfills`.
- Benefits: smaller bundles, no monkey-patching, better stack traces, and predictable rendering.
