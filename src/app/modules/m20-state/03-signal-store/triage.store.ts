import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { Alert } from '../../../shared/domain/models';
import { AlertStatus, StatusFilter } from '../01-store/alerts.actions';

/**
 * The SAME feature as 01 + 02, as an NgRx SignalStore: no actions, no reducer, no effects file.
 * State is signals; methods change it with patchState; entities get an id-indexed collection for free.
 * Provided per page (providers: [AlertTriageStore]) so it lives and dies with the page.
 */
export const AlertTriageStore = signalStore(
  withEntities<Alert>(),                                          // entities(), entityMap(), ids()
  withState({ filter: 'ALL' as StatusFilter, loading: false, error: null as string | null }),
  withComputed(({ entities, filter }) => ({
    visible: computed(() => (filter() === 'ALL' ? entities() : entities().filter(a => a.status === filter()))),
    counts: computed(() => ({
      NEW: entities().filter(a => a.status === 'NEW').length,
      TRIAGED: entities().filter(a => a.status === 'TRIAGED').length,
      RESOLVED: entities().filter(a => a.status === 'RESOLVED').length,
    })),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    setFilter(filter: StatusFilter) {
      patchState(store, { filter });
    },
    /** rxMethod: a method backed by an RxJS pipeline. Call it with a value, a signal or an observable. */
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          http.get<Alert[]>('/api/v1/alerts').pipe(
            tap({
              next: alerts => patchState(store, setAllEntities(alerts), { loading: false }),
              error: (e: HttpErrorResponse) => patchState(store, { loading: false, error: e.error?.detail ?? e.message }),
            }),
            catchError(() => EMPTY), // swallow AFTER handling, or the error kills the whole rxMethod pipeline
          ),
        ),
      ),
    ),

    triage(id: number, status: AlertStatus) {
      const previous = store.entityMap()[id]?.status;
      if (!previous) return;
      patchState(store, updateEntity({ id, changes: { status } }), { error: null });
      http.patch<Alert>(`/api/v1/alerts/${id}`, { status }).subscribe({
        next: alert => patchState(store, updateEntity({ id, changes: alert })),
        error: (e: HttpErrorResponse) => patchState(store, updateEntity({ id, changes: { status: previous } }), { error: e.error?.detail ?? e.message }),
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
