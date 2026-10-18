# M17.01 · Creating components from code  ⏱ 50 min

Most components are **declared** in templates. Some are only known at **runtime**: toasts, dialogs, a plugin chosen from config. For those, you create them from code at an anchor:

```ts
private readonly slot = viewChild.required('slot', { read: ViewContainerRef });   // <ng-container #slot />

const ref = this.slot().createComponent(AlertToast, {
  bindings: [
    inputBinding('message', () => this.msg()),      // a function: pass a signal and the input stays in sync
    outputBinding('dismiss', () => ref.destroy()),  // listen to an output
  ],
});
severity.set('CRITICAL');                          // bound with inputBinding('severity', severity): the toast follows
ref.setInput('other', x);                           // Gen 2 way, for inputs NOT bound through `bindings`
ref.destroy();                                      // remove it (DOM + listeners + DestroyRef callbacks)
```

## Your tasks: `page.ts` TODO 1–3

## Senior notes
- **Always destroy what you create.** The view container destroys its views when the host is destroyed, but timers and subscriptions you started are yours to clean up.
- `bindings` (v20+) behave like template bindings: `inputBinding('x', signal)` updates when the signal changes. With `setInput` you push values imperatively.
- A **global** toast service usually creates components with `createComponent(Type, { environmentInjector })` + `appRef.attachView()` + appending `ref.location.nativeElement` to `document.body`. The CDK `Overlay` does this properly (positioning, focus, a11y). M26 uses it.
- **Gen 1:** `ComponentFactoryResolver.resolveComponentFactory(X)` + `vcr.createComponent(factory)` + `ref.instance.message = …` + `ref.changeDetectorRef.detectChanges()`, and `entryComponents` in the NgModule. **Gen 2 (v13–v19):** `vcr.createComponent(X)` + `ref.setInput()` (v14.1). **Gen 3 (v20+):** `bindings: [inputBinding, outputBinding, twoWayBinding]`.
