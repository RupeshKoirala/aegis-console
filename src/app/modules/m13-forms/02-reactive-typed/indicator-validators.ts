import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { IndicatorView, Page } from '../../../shared/domain/models';
import { classify } from '../indicator-format';

/** TODO 1: null when empty (that's `required`'s job) or classify() recognises it; otherwise { indicator: { value } }. */
export const indicatorValidator: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null => {
  const value = control.value?.trim();
  if (!value) return null;
  return classify(value) ? null : { indicator: { value } };
};

/**
 * TODO 2: a GROUP validator. When listKind is 'THREAT', category must be non-empty and score an integer 1–100.
 * Otherwise return { threatFields: ['category', 'score'] } listing only the bad field names. Non-threat lists: null.
 */
export const threatNeedsScore: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const { listKind, category, score } = group.value as { listKind: string; category: string; score: number | null };
  if (listKind !== 'THREAT') return null;
  const bad: string[] = [];
  if (!category?.trim()) bad.push('category');
  if (!(Number.isInteger(score) && score! >= 1 && score! <= 100)) bad.push('score');
  return bad.length ? { threatFields: bad } : null;
};

/**
 * TODO 3: an ASYNC validator: GET /api/v1/lists/{listId}/indicators?q=<value>&size=200 and return
 * { duplicate: true } when an item's value equals the trimmed, lower-cased input. Empty input → of(null)
 * without a request. A failing request must NOT block the user: map errors to null.
 */
export function uniqueOnList(http: HttpClient, listId: () => number): AsyncValidatorFn {
  return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
    const value = control.value?.trim().toLowerCase();
    if (!value) return of(null);
    return http.get<Page<IndicatorView>>(`/api/v1/lists/${listId()}/indicators`, { params: { q: value, size: 200 } }).pipe(
      map(page => (page.items.some(i => i.value === value) ? { duplicate: true } : null)),
      catchError(() => of(null)),
    );
  };
}
