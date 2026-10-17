import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { EMPTY, NewIndicator, indicatorSchema } from './indicator.schema';
import { Page } from './page';

function make(start: Partial<NewIndicator> = {}) {
  const model = signal<NewIndicator>({ ...EMPTY, ...start });
  const f = TestBed.runInInjectionContext(() => form(model, indicatorSchema));
  return { model, f };
}
const kinds = (errs: { kind: string }[]) => errs.map(e => e.kind);

describe('M13.05 · Signal Forms', () => {
  it('TODO 1: value is required and must be an indicator', () => {
    const { model, f } = make();
    expect(kinds(f.value().errors())).toEqual(['required']);
    expect(f.value().errors()[0].message).toBe('Required');
    model.update(m => ({ ...m, value: 'nope!' }));
    expect(f.value().errors()).toEqual([expect.objectContaining({ kind: 'indicator', message: 'Not an IPv4, CIDR or domain' })]);
    f.value().value.set('198.51.100.0/24');
    expect(f.value().valid()).toBe(true);
    expect(model().value).toBe('198.51.100.0/24');
  });

  it('TODO 2: description max 200', () => {
    const { f } = make({ value: 'evil.example', description: 'x'.repeat(201) });
    expect(kinds(f.description().errors())).toEqual(['maxLength']);
  });

  it('TODO 3: threat-only fields are conditional and hidden otherwise', () => {
    const { f } = make({ value: '203.0.113.9' });
    expect(f.category().hidden()).toBe(true);
    expect(f.score().hidden()).toBe(true);
    expect(f().valid()).toBe(true);
    f.listKind().value.set('THREAT');
    expect(f.category().hidden()).toBe(false);
    expect(f().valid()).toBe(false);
    expect(kinds(f.score().errors())).toContain('required');
    f.score().value.set(150);
    expect(kinds(f.score().errors())).toEqual(['max']);
    f.score().value.set(90);
    f.category().value.set('Botnets');
    expect(f().valid()).toBe(true);
  });

  it('TODO 4: submit only saves valid forms, then resets', async () => {
    const page = TestBed.runInInjectionContext(() => new Page());
    expect(await page.save()).toBe(false);
    expect(page.f.value().touched()).toBe(true);
    expect(page.saved()).toEqual([]);
    page.f.value().value.set(' Evil.Example ');
    expect(await page.save()).toBe(true);
    expect(page.saved()).toEqual([{ ...EMPTY, value: 'evil.example' }]);
    expect(page.model().value).toBe('');
    expect(page.f.value().touched()).toBe(false);
  });
});
