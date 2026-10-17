# Authoring source (not for learners)
`modules/` is the single source of the exercises, with `//@@sol` / `//@@stub` / `//@@end` markers (`<!--@@…-->` in HTML).
`tools/gen.mjs stub|sol modules <app>/src/app/modules` produces the `main` (stub) or `solutions` tree.
