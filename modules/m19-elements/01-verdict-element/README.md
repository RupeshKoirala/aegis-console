# M19.01 · An embeddable verdict badge  ⏱ 45 min

Partners want to show Aegis verdicts on **their** pages: an MSP's customer portal, a status page, a WordPress plugin. They don't use Angular, and they shouldn't have to. **Angular Elements** wraps a component as a standard **custom element** that works in any HTML:

```html
<aegis-verdict value="203.0.113.66" verdict="BLOCK"></aegis-verdict>
<script>document.querySelector('aegis-verdict').addEventListener('details', e => console.log(e.detail));</script>
```
```ts
customElements.define('aegis-verdict', createCustomElement(VerdictBadge, { injector }));
```
| Angular side | Custom element side |
|---|---|
| `value = input('')` | attribute `value="…"` **and** property `el.value = …` (camelCase input → kebab-case attribute) |
| `details = output<…>()` | DOM `CustomEvent('details')`, payload in `event.detail` |
| `ViewEncapsulation.ShadowDom` | real shadow DOM: the host page's CSS can't break it |

## Your tasks: `define.ts` TODO 1
Then open `/m19/01`: section 2 is plain `innerHTML` + `addEventListener`, exactly what a partner would write.

## Lab: ship it as one file (20 min, optional)
1. `npx ng generate application verdict-widget --minimal` (a second, tiny app), whose `main.ts` does `createApplication()` then `customElements.define(…)`.
2. Build it: `npx ng build verdict-widget`. Use `--output-hashing none` for a stable file name.
3. A plain `embed.html` with `<script src="main.js">` and two `<aegis-verdict>` tags. Open it with any static server.
Notice the size: each Angular element bundle carries the framework runtime. That's fine for one rich widget, but expensive for ten small ones. Share one bundle that defines all of them.

## Senior notes
- **The injector you define with lives forever** in that element class. Use an app-lifetime injector (`createApplication().injector`, or the root `EnvironmentInjector`), never a component's: it's destroyed on navigation and you get `NG0205: Injector has already been destroyed`.
- **Attributes are strings.** `verdict="BLOCK"` is fine. A number or object input needs a property (`el.limit = 5`) or a `transform` on the input.
- Defining a tag twice throws, which is common with micro-frontends loading the same widget. Guard with `customElements.get`.
- Security: anything a host page passes in is untrusted. Never bind it to `innerHTML`.
- Elements are one way to build **micro-frontends**. Module Federation / native federation is the other big one, sharing Angular itself between independently deployed apps.
- **Gen 1:** no Elements before v6. **Gen 2 (v6+):** `createCustomElement` from an NgModule's `entryComponents` + `ngDoBootstrap`. **Gen 3:** standalone component + `createApplication()`, no NgModule at all.
