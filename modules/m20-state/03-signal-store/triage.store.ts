import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
//@@sol
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
//@@end
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
//@@sol
    visible: computed(() => (filter() === 'ALL' ? entities() : entities().filter(a => a.status === filter()))),
    counts: computed(() => ({
      NEW: entities().filter(a => a.status === 'NEW').length,
      TRIAGED: entities().filter(a => a.status === 'TRIAGED').length,
      RESOLVED: entities().filter(a => a.status === 'RESOLVED').length,
    })),
//@@stub
    // TODO 1: visible (filtered entities) and counts ({ NEW, TRIAGED, RESOLVED }), like 01's selectors
    visible: computed(() => [] as Alert[]),
    counts: computed(() => ({ NEW: 0, TRIAGED: 0, RESOLVED: 0 })),
//@@end
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    setFilter(filter: StatusFilter) {
      patchState(store, { filter });
    },
//@@sol
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
//@@stub
    /**
     * TODO 2: load = rxMethod<void>(pipe(
     *   tap(() => patchState(store, { loading: true, error: null })),
     *   switchMap(() => http.get<Alert[]>('/api/v1/alerts').pipe(tap({
     *     next: alerts => patchState(store, setAllEntities(alerts), { loading: false }),
     *     error: e => patchState(store, { loading: false, error: e.error?.detail ?? e.message }) }),
     *   catchError(() => EMPTY))))                 ← REQUIRED: tap's error handler doesn't stop the error;
     * without catchError the error reaches the outer pipe and load() never works again.
     * (@ngrx/operators' tapResponse does next/error/catch in one operator.)
     */
    load: rxMethod<void>(source => source),

    /**
     * TODO 3: optimistic triage with rollback:
     *   remember previous = store.entityMap()[id].status → updateEntity({ id, changes: { status } }) + error null
     *   → PATCH /api/v1/alerts/{id} { status } → success: updateEntity with the server's alert
     *                                         → error: put previous back + set error
     */
    triage(_id: number, _status: AlertStatus) {
    },
//@@end
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
