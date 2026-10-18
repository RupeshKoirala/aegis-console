# M21.02 · Reading & porting `@angular/animations`  ⏱ 40 min

You'll inherit code like this for years, and it has a deadline: `provideAnimations*` is **deprecated since v20.2, with removal planned for v23**.

```ts
animations: [trigger('expand', [
  state('collapsed', style({ height: '0px', opacity: 0 })),
  state('expanded',  style({ height: '*', opacity: 1 })),       // '*' = "whatever the natural height is"
  transition('collapsed => expanded', animate('200ms ease-out')),
])]
// template: <div [@expand]="open() ? 'expanded' : 'collapsed'">
```
The killer feature was `height: '*'` (animating to an unknown height). CSS can do that now:
```css
.body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms ease-out; }
.body.open { grid-template-rows: 1fr; }
.body > .inner { overflow: hidden; }
```

## Your tasks
- `legacy-panel.ts` TODO 1: add one line in the old API (you need to be able to *write* it to maintain it)
- `modern-panel.ts` TODO 2: the port

Compare both panels side by side at `/m21/02`.

## Migration map
| `@angular/animations` | Gen 3 |
|---|---|
| `:enter` / `:leave` transitions | `animate.enter` / `animate.leave` (M21.01) |
| `state()` + `transition()` between states | a class + CSS `transition` |
| `height: '*'` | `grid-template-rows: 0fr → 1fr`, or `interpolate-size: allow-keywords` where supported |
| `query()` + `stagger()` for lists | `animation-delay: calc(var(--i) * 40ms)` with `[style.--i]="$index"` |
| `group()` / `sequence()` | multiple CSS animations / `animation-delay`, or the Web Animations API |
| `AnimationEvent` callbacks | `(animate.leave)` function / `animationend` |

## Senior notes
- The content must **stay in the DOM** to transition. That's why the port uses a class, not `@if`. If you need it *removed*, use `@if` + `animate.leave`.
- Migrate component by component; both systems coexist until the last trigger is gone. Then drop `@angular/animations` and `provideAnimationsAsync()`, and your bundle shrinks.
