# M21.01 · Native animations: `animate.enter` / `animate.leave`  ⏱ 40 min

New alerts should *arrive* (slide in) and *leave* (slide out) so the analyst's eye catches them, without a 60 KB animation library. Since v20.2 Angular animates with **plain CSS** plus two template features:

```html
<div animate.enter="toast-in">…</div>          <!-- class added on insert, removed when its CSS animation ends -->
<div animate.leave="toast-out">…</div>         <!-- class added on removal; element stays until the animation ends -->
<div (animate.leave)="slideOut($event)">…</div> <!-- or a function: call $event.animationComplete() when done -->
```
They work on any element, and in a component's `host: { 'animate.enter': 'toast-in' }`, which is the cleanest place for "this component always animates in".

## Your tasks
- `toast-card.ts` TODO 1–2
- `motion.ts` TODO 3

The tests check the compiled output and call `slideOut` with a fake event. jsdom doesn't run animations, so open `/m21/01` to actually *see* them.

## Senior notes
- **Respect `prefers-reduced-motion`.** For some people motion causes nausea. This is an accessibility requirement (WCAG 2.3.3), not a nicety. Both the CSS (`@media`) and the JS path must honour it.
- With emulated encapsulation Angular **scopes `@keyframes` names** per component (`_ngcontent-xyz_toast-in`), so a keyframe defined in one component can't be used from global CSS by its plain name.
- Animate `transform` and `opacity` only. They run on the compositor. Animating `height`, `top` or `width` triggers layout on every frame (jank on a busy SOC wall screen).
- Leave animations delay removal: never make them long, and always call `animationComplete()`, or the element stays in the DOM forever.
- **Gen 1/2 (v4–v20):** `@angular/animations` with `trigger/state/style/transition/animate`, `provideAnimations()`, and `[@trigger]` bindings (M21.02). **Deprecated in v20.2, removal planned for v23.** **Gen 3:** CSS + `animate.enter/leave`, with no extra package.
