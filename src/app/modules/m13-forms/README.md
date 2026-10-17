# M13 · Forms (3 generations)

📖 **Read first (Study Hub):** `angular-manual/m15` forms: three generations · `angular/l17` forms, taking user input · `cyber/l5` IP addresses, ports & subnets (for the CIDR rules)

Every SOC console is mostly forms: add an indicator, write a policy, invite a user. Angular has **three** form systems, and you'll meet all of them at work. The same "add an indicator" form gets built in each, so you can compare them directly.

| # | Exercise | You practise |
|---|---|---|
| 01 | Template-driven | `FormsModule`, `[(ngModel)]` on signals, `#ctrl="ngModel"`, `ngForm`, when to show errors, `resetForm` |
| 02 | Reactive, typed | `FormBuilder.nonNullable`, typed controls, custom sync/async/cross-field validators |
| 03 | `FormArray` | dynamic rows, array-level validators, reordering, form → signal with `toSignal` |
| 04 | `ControlValueAccessor` | your own component behaving like a native input (`formControl`, disabled, touched, validation) |
| 05 | Signal Forms | `form()`, schema functions, `[formField]`, `validate`, `applyWhen`, `hidden`, `submit` |

### Generations
- **Gen 1 (v2–v13):** `FormsModule` / `ReactiveFormsModule` with **untyped** `FormGroup` (`any` everywhere), `valueChanges` + `async` pipe, and `NG_VALUE_ACCESSOR` for custom controls.
- **Gen 2 (v14–v20):** **typed** reactive forms (`fb.nonNullable`, `FormControl<string>`, `getRawValue()`), plus `UntypedFormGroup` for migrations. Bridged to signals with `toSignal(form.valueChanges)`.
- **Gen 3 (v21–v22):** **Signal Forms** (`@angular/forms/signals`): the model is a `signal`, the form is a tree of field signals, validation is a schema function. Custom controls implement `FormValueControl<T>` with a `model()` instead of a ControlValueAccessor.

Template-driven and reactive forms are **not** deprecated, and most existing code bases use them. Learn all three.
