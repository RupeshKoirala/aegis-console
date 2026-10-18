// Done for you: the EVENTS of the alert-triage feature. Read them as a log of "what happened",
// named by where they come from ([Alerts Page] …, [Alerts API] …), never as commands ("setLoading").
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Alert } from '../../../shared/domain/models';

export type AlertStatus = Alert['status'];
export type StatusFilter = AlertStatus | 'ALL';

export const AlertsPageActions = createActionGroup({
  source: 'Alerts Page',
  events: {
    Opened: emptyProps(),
    'Filter Changed': props<{ filter: StatusFilter }>(),
    'Triage Clicked': props<{ id: number; status: AlertStatus; previous: AlertStatus }>(),
  },
});

export const AlertsApiActions = createActionGroup({
  source: 'Alerts API',
  events: {
    'Load Succeeded': props<{ alerts: Alert[] }>(),
    'Load Failed': props<{ error: string }>(),
    'Triage Succeeded': props<{ alert: Alert }>(),
    'Triage Failed': props<{ id: number; previous: AlertStatus; error: string }>(),
  },
});
