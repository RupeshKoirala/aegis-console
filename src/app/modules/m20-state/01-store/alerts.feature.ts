import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Alert } from '../../../shared/domain/models';
import { AlertStatus, AlertsApiActions, AlertsPageActions, StatusFilter } from './alerts.actions';

export interface AlertsState {
  alerts: Alert[];
  filter: StatusFilter;
  loading: boolean;
  error: string | null;
}

export const initialState: AlertsState = { alerts: [], filter: 'ALL', loading: false, error: null };

const setStatus = (alerts: Alert[], id: number, status: AlertStatus) => alerts.map(a => (a.id === id ? { ...a, status } : a));

/**
 * TODO 1: the reducer: a PURE function (state, action) → new state. No HTTP, no Date.now(), no mutation.
 *   Opened            loading true, error null
 *   Load Succeeded    alerts, loading false
 *   Load Failed       error, loading false
 *   Filter Changed    filter
 *   Triage Clicked    OPTIMISTIC: set that alert's status right away, clear error   (setStatus helper above)
 *   Triage Succeeded  replace the alert with the server's version
 *   Triage Failed     put `previous` back, set error
 *
 * TODO 2: extraSelectors (memoized, derived state):
 *   selectVisible  alerts matching the filter ('ALL' = every alert)
 *   selectCounts   { NEW: n, TRIAGED: n, RESOLVED: n }
 * createFeature already generates selectAlerts, selectFilter, selectLoading, selectError for you.
 */
export const alertsFeature = createFeature({
  name: 'alerts',
  reducer: createReducer(
    initialState,
    on(AlertsPageActions.opened, (s): AlertsState => s),
  ),
  extraSelectors: ({ selectAlerts, selectFilter }) => ({
    selectVisible: createSelector(selectAlerts, selectFilter, (_alerts, _filter) => [] as Alert[]),
    selectCounts: createSelector(selectAlerts, _alerts => ({ NEW: 0, TRIAGED: 0, RESOLVED: 0 })),
  }),
});
