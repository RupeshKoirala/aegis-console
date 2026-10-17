import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { IndicatorView, Page } from '../../../shared/domain/models';

/** TODO 1: null when empty (that's `required`'s job) or classify() recognises it; otherwise { indicator: { value } }. */
export const indicatorValidator: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null => {
  return null;
};

/**
 * TODO 2: a GROUP validator. When listKind is 'THREAT', category must be non-empty and score an integer 1–100.
 * Otherwise return { threatFields: ['category', 'score'] } listing only the bad field names. Non-threat lists: null.
 */
export const threatNeedsScore: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  return null;
};

/**
 * TODO 3: an ASYNC validator: GET /api/v1/lists/{listId}/indicators?q=<value>&size=200 and return
 * { duplicate: true } when an item's value equals the trimmed, lower-cased input. Empty input → of(null)
 * without a request. A failing request must NOT block the user: map errors to null.
 */
export function uniqueOnList(http: HttpClient, listId: () => number): AsyncValidatorFn {
  return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
    return of(null);
  };
}
