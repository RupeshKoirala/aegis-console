# M13.02 · Reactive, typed forms & custom validators  ⏱ 60 min

In reactive forms the **class** owns the form model and the template only binds to it (`[formGroup]`, `formControlName`). Everything is synchronous and unit-testable without a DOM.

```ts
form = this.fb.nonNullable.group({
  listKind: 'BLOCK' as ListKind,
  value: this.fb.nonNullable.control('', { validators: [...], asyncValidators: [...], updateOn: 'blur' }),
  score: this.fb.control<number | null>(null),
}, { validators: threatNeedsScore });

this.form.controls.value.value      // string, not any
this.form.getRawValue()             // { listKind: ListKind; value: string; score: number | null }
```
Three validator shapes:
- **Sync** `ValidatorFn`: `(control) => ValidationErrors | null`
- **Cross-field**: the same signature, put on the **group**, which reads several children
- **Async** `AsyncValidatorFn`: returns an `Observable`/`Promise`. The control is `pending` until it completes. Async validators run only after the sync ones pass.

## Your tasks
- `indicator-validators.ts` TODO 1–3
- `page.ts` TODO 4

## Senior notes
- `nonNullable` matters: without it, `reset()` sets values to `null` and the types say `string | null` everywhere.
- Async validators **per keystroke** are a self-inflicted DDoS. Use `updateOn: 'blur'`, or debounce inside the validator (`timer(300).pipe(switchMap(...))`, which works because a new value unsubscribes the previous one).
- **OnPush (the v22 default):** nothing re-renders when an async validator finishes, because there's no event. The page reads `toSignal(form.statusChanges)` in its template so it does. Remember this pattern. It's the #1 "my form doesn't update" bug after moving to OnPush/zoneless.
- Errors from an async validator (API down) must not lock the form. Map them to `null` and let the server reject on submit (409).
- Gen 1 code you'll meet: `new FormGroup({ value: new FormControl('') })` typed as `any` (now `UntypedFormGroup`). Migrate by removing the `Untyped` prefix and fixing the compile errors it reveals.
