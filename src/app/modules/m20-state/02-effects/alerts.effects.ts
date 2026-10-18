import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
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
    actions$.pipe(
      ofType(AlertsPageActions.opened),
      switchMap(() =>
        http.get<Alert[]>('/api/v1/alerts').pipe(
          map(alerts => AlertsApiActions.loadSucceeded({ alerts })),
          catchError((e: HttpErrorResponse) => of(AlertsApiActions.loadFailed({ error: message(e) }))),
        ),
      ),
    ),
  { functional: true },
);

/**
 * TODO 2: triage. On Triage Clicked({ id, status, previous }) → PATCH /api/v1/alerts/{id} { status }
 *   → Triage Succeeded({ alert }) or Triage Failed({ id, previous, error }).
 *   mergeMap, NOT switchMap: triaging alert 1 and then alert 2 quickly must NOT cancel alert 1's request.
 */
export const triageAlert = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(AlertsPageActions.triageClicked),
      mergeMap(({ id, status, previous }) =>
        http.patch<Alert>(`/api/v1/alerts/${id}`, { status }).pipe(
          map(alert => AlertsApiActions.triageSucceeded({ alert })),
          catchError((e: HttpErrorResponse) => of(AlertsApiActions.triageFailed({ id, previous, error: message(e) }))),
        ),
      ),
    ),
  { functional: true },
);

export const alertsEffects = { loadAlerts, triageAlert };
