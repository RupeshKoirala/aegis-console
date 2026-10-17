import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Page } from './page';
import { HasRole } from './has-role.directive';
import { CurrentUser } from './current-user';
import { LISTS } from '../../../shared/domain/sample-data';

describe('M06.03 · *aegisHasRole', () => {
  let f: ComponentFixture<Page>;
  let el: HTMLElement;
  const count = (s: string) => el.querySelectorAll(s).length;
  const as = async (role: 'ADMIN' | 'ANALYST' | 'READ_ONLY') => {
    TestBed.inject(CurrentUser).role.set(role);
    await f.whenStable();
  };
  beforeEach(async () => {
    f = TestBed.createComponent(Page);
    el = f.nativeElement;
    await f.whenStable();
  });

  it('TODO 1 + 3: a directive with aegisHasRole / aegisHasRoleElse inputs', () => {
    const dir = (HasRole as any).ɵdir;
    expect(dir).toBeDefined();
    expect(Object.keys(dir.inputs)).toEqual(expect.arrayContaining(['aegisHasRole', 'aegisHasRoleElse']));
  });

  it('TODO 5: declares a template context guard', () => {
    expect(typeof (HasRole as any).ngTemplateContextGuard).toBe('function');
  });

  it('TODO 2 + 4 + 6: ANALYST can edit, cannot delete, sees the else template', async () => {
    await as('ANALYST');
    expect(count('.edit')).toBe(LISTS.length);
    expect(el.querySelector('.edit')?.textContent).toContain('edit as ANALYST');
    expect(count('button.delete')).toBe(0);
    expect(count('.locked')).toBe(LISTS.length);
  });

  it('TODO 4: reacts to role changes', async () => {
    await as('ADMIN');
    expect(count('button.delete')).toBe(LISTS.length);
    expect(count('.locked')).toBe(0);
    expect(el.querySelector('.edit')?.textContent).toContain('edit as ADMIN');
    await as('READ_ONLY');
    expect(count('.edit')).toBe(0);
    expect(count('button.delete')).toBe(0);
    expect(count('.locked')).toBe(LISTS.length);
  });
});
