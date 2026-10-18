# M17 · Dynamic components

📖 **Read first (Study Hub):** `angular-manual/m3` components · `angular-manual/m9` component communication

When the component to show is only known at runtime (a toast raised by an alert, a widget picked by a saved layout), you create it from code or render a component *type* held in a variable.

| # | Exercise | You practise |
|---|---|---|
| 01 | Toast host | `viewChild(…, { read: ViewContainerRef })`, `createComponent` with `inputBinding`/`outputBinding`, `setInput`, `destroy`, cleanup |
| 02 | Configurable dashboard | a lazy registry of `import()` loaders, `Promise.all`, `NgComponentOutlet` with inputs, `resource()`, fallbacks |

### Generations
- **Gen 1:** `ComponentFactoryResolver` + `entryComponents`, and assigning `ref.instance.x` by hand.
- **Gen 2 (v13–v19):** `vcr.createComponent(Type)`, `ref.setInput()`, `ngComponentOutletInputs`.
- **Gen 3 (v20–v22):** `bindings: [inputBinding(), outputBinding(), twoWayBinding()]`, signal-aware.
