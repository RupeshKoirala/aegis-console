import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Alert } from '../../../shared/domain/models';
import { AlertsApiActions, AlertsPageActions } from '../01-store/alerts.actions';

const message = (e: HttpErrorResponse) => e.error?.detail ?? e.message;

/**
 * TODO 1: load. On [Alerts Page] Opened → GET /api/v1/alerts → Load Succeeded({ alerts }) or Load Failed({ error }).
 *   switchMap: opening the page again cancels a slow earlier load.
 *   catchError INSIDE the switchMap: an effect whose stream errors DIES and never reacts again.
 *   error text: the problem `detail` if the API sent one (e.error?.detail), else e.message.
 */
export const loadAlerts = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    EMPTY as Observable<Action>,
  { functional: true },
);

/**
 * TODO 2: triage. On Triage Clicked({ id, status, previous }) → PATCH /api/v1/alerts/{id} { status }
 *   → Triage Succeeded({ alert }) or Triage Failed({ id, previous, error }).
 *   mergeMap, NOT switchMap: triaging alert 1 and then alert 2 quickly must NOT cancel alert 1's request.
 */
export const triageAlert = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    EMPTY as Observable<Action>,
  { functional: true },
);

export const alertsEffects = { loadAlerts, triageAlert };
