import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ALERTS } from '../../../shared/domain/sample-data';
import { AlertsApiActions, AlertsPageActions } from './alerts.actions';
import { alertsFeature } from './alerts.feature';
import { TriageView } from './triage-view';

@Component({
  selector: 'app-m20-01',
  imports: [TriageView],
  template: `
    <h1>Alert triage <small class="muted">NgRx store: actions, reducer, selectors</small></h1>
    <p class="muted">No HTTP yet (that's effects, in 02). The page feeds sample data in through an action. Install the Redux DevTools browser extension to watch every action and state change.</p>
    <aegis-triage-view [alerts]="visible()" [filter]="filter()" [counts]="counts()" [error]="error()"
      (filterChange)="store.dispatch(page.filterChanged({ filter: $event }))"
      (triage)="store.dispatch(page.triageClicked($event))" />
  `,
})
export class Page {
  protected readonly store = inject(Store);
  protected readonly page = AlertsPageActions;
  readonly visible = this.store.selectSignal(alertsFeature.selectVisible);
  readonly filter = this.store.selectSignal(alertsFeature.selectFilter);
  readonly counts = this.store.selectSignal(alertsFeature.selectCounts);
  readonly error = this.store.selectSignal(alertsFeature.selectError);

  constructor() {
    this.store.dispatch(AlertsApiActions.loadSucceeded({ alerts: ALERTS }));
  }
}
