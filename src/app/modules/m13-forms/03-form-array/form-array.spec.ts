import { TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { newRule, noDuplicateCategories, RuleForm } from './rules';
import { Page } from './page';

describe('M13.03 · FormArray', () => {
  it('TODO 1: newRule validates its fields', () => {
    const r = newRule();
    expect(r.valid).toBe(false);
    expect(r.controls.category.hasError('required')).toBe(true);
    r.controls.category.setValue('Phishing');
    r.controls.minScore.setValue(0);
    expect(r.controls.minScore.hasError('min')).toBe(true);
    r.controls.minScore.setValue(101);
    expect(r.controls.minScore.hasError('max')).toBe(true);
    r.controls.minScore.setValue(50);
    expect(r.valid).toBe(true);
    r.reset();
    expect(r.getRawValue()).toEqual({ category: '', minScore: 80, action: 'BLOCK' });
  });

  it('TODO 2: duplicate categories invalidate the array', () => {
    const arr = new FormArray<RuleForm>([newRule('Botnets'), newRule('Phishing'), newRule('')], { validators: noDuplicateCategories });
    expect(arr.errors).toBeNull();
    arr.at(2).controls.category.setValue('Botnets');
    expect(arr.errors).toEqual({ duplicateCategory: 'Botnets' });
  });

  it('TODO 3: summary follows edits', () => {
    const page = TestBed.runInInjectionContext(() => new Page());
    expect(page.summary()).toEqual(['BLOCK Botnets when score ≥ 90', 'BLOCK Phishing when score ≥ 80', 'ALERT Scanners when score ≥ 60']);
    page.rules.at(0).controls.minScore.setValue(95);
    expect(page.summary()[0]).toBe('BLOCK Botnets when score ≥ 95');
  });

  it('TODO 4: add, remove, move up (same instances, one emission)', () => {
    const page = TestBed.runInInjectionContext(() => new Page());
    page.add();
    expect(page.rules.length).toBe(4);
    expect(page.summary()[3]).toBe('BLOCK ? when score ≥ 80');
    page.remove(3);
    const phishing = page.rules.at(1);
    let emissions = 0;
    page.rules.valueChanges.subscribe(() => emissions++);
    page.moveUp(1);
    expect(page.rules.at(0)).toBe(phishing);
    expect(emissions).toBe(1);
    expect(page.summary()[0]).toBe('BLOCK Phishing when score ≥ 80');
    page.moveUp(0);
    expect(page.rules.at(0)).toBe(phishing);
  });
});
