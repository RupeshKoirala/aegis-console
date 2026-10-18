# M21 · Animations

📖 **Read first (Study Hub):** `angular-manual/m3` components · `foundations/l17` how browsers render pages (layout vs. compositing)

| # | Exercise | You practise |
|---|---|---|
| 01 | Native animations | `animate.enter` / `animate.leave` (class and function forms, in host bindings), CSS keyframes, the Web Animations API, `prefers-reduced-motion` |
| 02 | Port a legacy animation | reading `trigger/state/transition`, CSS height transitions, a migration map |

### Generations
- **Gen 1 (v4–v14):** `BrowserAnimationsModule` + `@angular/animations` DSL.
- **Gen 2 (v15–v20):** the same with `provideAnimations()` / `provideAnimationsAsync()` (lazy-loaded engine).
- **Gen 3 (v20.2–v22):** `animate.enter` / `animate.leave` + plain CSS. The old package is deprecated, with removal planned for v23.
