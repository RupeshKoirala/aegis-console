import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export type RuleAction = 'BLOCK' | 'ALERT';
export type RuleForm = FormGroup<{
  category: FormControl<string>;
  minScore: FormControl<number>;
  action: FormControl<RuleAction>;
}>;

/** TODO 1: one rule row. category required; minScore required, 1–100; action defaults to 'BLOCK'. All non-nullable. */
export function newRule(category = '', minScore = 80, action: RuleAction = 'BLOCK'): RuleForm {
//@@sol
  return new FormGroup({
    category: new FormControl(category, { nonNullable: true, validators: [Validators.required] }),
    minScore: new FormControl(minScore, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
    action: new FormControl<RuleAction>(action, { nonNullable: true }),
  });
//@@stub
  return new FormGroup({
    category: new FormControl(category, { nonNullable: true }),
    minScore: new FormControl(minScore, { nonNullable: true }),
    action: new FormControl<RuleAction>(action, { nonNullable: true }),
  });
//@@end
}

/** TODO 2: an ARRAY validator: two rows with the same category → { duplicateCategory: '<that category>' }. Ignore empty. */
export const noDuplicateCategories: ValidatorFn = (array: AbstractControl): ValidationErrors | null => {
//@@sol
  const seen = new Set<string>();
  for (const { category } of (array as FormArray<RuleForm>).getRawValue()) {
    if (!category) continue;
    if (seen.has(category)) return { duplicateCategory: category };
    seen.add(category);
  }
  return null;
//@@stub
  return null;
//@@end
};
