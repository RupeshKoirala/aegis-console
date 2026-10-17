# M13.01 · Template-driven forms  ⏱ 40 min

The quickest way to get a form on screen. The **template** declares the controls, and `ngModel` creates them for you behind the scenes.

```html
<form #f="ngForm" (ngSubmit)="add(f)" novalidate>
  <input name="value" [(ngModel)]="value" required [pattern]="pattern" #valueCtrl="ngModel" />
  @if (valueCtrl.invalid && (valueCtrl.touched || f.submitted)) { … }
  <button [disabled]="f.invalid">Block</button>
</form>
```
- `name` is required: it's the key in `f.value`.
- `[(ngModel)]="value"` works directly with a **writable signal** (Gen 3). In Gen 1/2 it was a plain field: `[(ngModel)]="model.value"`.
- `#valueCtrl="ngModel"` gives you the `NgModel` (`valid`, `touched`, `dirty`, `errors`, `hasError()`).
- `required`, `pattern`, `minlength`, `maxlength`, `email`, `min`, `max` are **directives** that FormsModule attaches to those attributes.

**Validation UX rule:** never shout at a user who hasn't typed yet. Show errors when the field is `touched` (blurred) **or** the form was submitted.

## Your tasks: `page.ts` TODO 1–5
`npm run ex m13/01` and `npx ng test --include src/app/modules/m13-forms/01-template-driven`

## Senior notes
- Template-driven forms update **asynchronously** (ngModel writes in a microtask). That's why the tests `await fixture.whenStable()`. Reactive forms are synchronous, and that's a big reason teams pick them for complex forms.
- **OnPush + template-driven gotcha:** `NgForm`/`NgModel` state isn't a signal. The controls register in a microtask *after* the first render, so `[disabled]="f.invalid"` shows the stale value until the next event (focus, input…) refreshes the view. Reactive forms have the same issue with `form.invalid`. Signal Forms (05) don't, because their state is made of signals.
- `f.reset()` clears values. `f.resetForm(value)` also clears `submitted`, which is why it's the right call after a successful submit.
- Interview question: *"When would you still choose template-driven?"* Small, flat forms with no dynamic structure. Once you need conditional validators, arrays or unit-testable logic, use reactive forms or Signal Forms.
- Security: client-side validation is **UX, not protection**. The API validates the same rules again (`400` + `errors.value`).
