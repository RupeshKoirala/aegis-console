# M13.04 · ControlValueAccessor: a CIDR input  ⏱ 55 min

A CIDR is two things to the user (an address, plus a prefix picked from a list) but **one value** to the form: `"198.51.100.0/24"`. You want to write
```html
<aegis-cidr-input [formControl]="range" />     <!-- or formControlName="range", or [(ngModel)] -->
```
and have `required`, `disabled`, `touched`, `dirty` and `reset()` just work. The bridge between any form directive and your component is **`ControlValueAccessor`**:

| Method | Direction | When |
|---|---|---|
| `writeValue(v)` | form → UI | initial value, `setValue`, `reset` |
| `registerOnChange(fn)` | UI → form | you call `fn(newValue)` when the user edits |
| `registerOnTouched(fn)` | UI → form | you call `fn()` on blur |
| `setDisabledState(b)` | form → UI | `control.disable()` / `enable()` |

Register it with `{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CidrInput), multi: true }`. Add `NG_VALIDATORS` + `validate()` and the component also **validates itself**, wherever it's used.

## Your tasks
- `cidr-input.ts` TODO 1–4
- `page.ts` TODO 5

## Senior notes
- **Never** call `onChange` inside `writeValue`. That would mark the form dirty on load and can loop.
- `forwardRef` is needed because the class is referenced inside its own decorator, before it's defined.
- The alternative is to *inject* `NgControl` (`inject(NgControl, { self: true })` and set `ngControl.valueAccessor = this`). That avoids the provider, and gives the component access to the control's errors to render them itself.
- **Gen 3:** with Signal Forms, a custom control implements `FormValueControl<string>` with `readonly value = model('')` plus optional `disabled`, `touched`, `errors` inputs. No accessor, no providers, no forwardRef. M13.05 shows the field side of that.
