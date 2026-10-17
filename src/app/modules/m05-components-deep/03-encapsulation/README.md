# M05.03 · View encapsulation  ⏱ 35 min

## Concepts
Component CSS is **scoped**. Angular rewrites your selectors so they only match this component's elements:
```css
/* you write */            /* Emulated (default) compiles to */
.badge { … }               .badge[_ngcontent-abc] { … }
:host { … }                [_nghost-abc] { … }
:host(.compact) { … }      .compact[_nghost-abc] { … }
:host-context(.dark) { … } .dark[_nghost-abc], .dark [_nghost-abc] { … }
```
| `encapsulation:` | Meaning |
|---|---|
| `ViewEncapsulation.Emulated` (default) | rewritten selectors with attributes, as above |
| `ViewEncapsulation.ShadowDom` | a real browser Shadow DOM: true isolation, but global styles don't get in |
| `ViewEncapsulation.None` | styles become **global**, so use rarely and prefix everything |

`::ng-deep` switches off scoping for the rest of the selector. It's deprecated but everywhere in legacy code. Typical use: styling HTML you didn't render yourself (`[innerHTML]` content, third-party widgets).

## Your tasks: `severity-badge.ts` (TODO 1–3), `shadow-badge.ts` (TODO 4), `global-reset.ts` (TODO 5)
The tests inspect the **compiled** styles (`ɵcmp.styles`), so you'll literally see what Angular generates.

## Senior notes
- `:host-context()` lets a component react to a theme class on any ancestor (`<body class="dark-tenant">`). It's the classic way to do per-tenant theming.
- Prefer **CSS custom properties** (`--accent`) for theming. They pierce every encapsulation mode, including Shadow DOM, which is why this console's palette is built on them.
- When styles "don't apply", inspect the element in DevTools and look for the `_ngcontent-*` attribute. Content you projected or injected with `innerHTML` doesn't have it.
