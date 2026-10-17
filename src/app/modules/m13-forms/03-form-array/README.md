# M13.03 · FormArray: a policy rule builder  ⏱ 50 min

A threat policy is an **ordered list of rules**: "BLOCK Botnets when score ≥ 90, ALERT Scanners when score ≥ 60…". The user adds, removes and reorders rows. That's what `FormArray` is for.

```ts
rules = new FormArray<RuleForm>([...], { validators: noDuplicateCategories });
rules.push(newRule());   rules.removeAt(i);   rules.insert(i, row);   rules.at(i)
```
In the template, loop over `rules.controls` and bind each row with `[formGroup]="rule"`. `track rule` (the instance) keeps DOM rows attached to their controls while you reorder.

**Form → signal:** reactive forms speak RxJS. `toSignal(rules.valueChanges, { initialValue: rules.getRawValue() })` gives you a signal you can `computed()` from.

## Your tasks
- `rules.ts` TODO 1–2
- `page.ts` TODO 3–4

## Senior notes
- `valueChanges` emits `value`, which **skips disabled controls**. Use `getRawValue()` when you need everything.
- Every `push`/`removeAt`/`insert` emits once. A move done as remove + insert emits twice unless you pass `{ emitEvent: false }` to the first call. That matters when something saves on each change.
- Very large arrays (hundreds of rows) are slow in any form library. Paginate them, or edit one row at a time in a side panel.
- Gen 3 equivalent: in Signal Forms an array field is just an array in the model, and `applyEach(path.rules, ruleSchema)` validates every item.
