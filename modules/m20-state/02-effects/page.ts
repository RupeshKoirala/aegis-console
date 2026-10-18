import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertsPageActions } from '../01-store/alerts.actions';
import { alertsFeature } from '../01-store/alerts.feature';
import { TriageView } from '../01-store/triage-view';

@Component({
  selector: 'app-m20-02',
  imports: [TriageView],
  template: `
    <h1>Alert triage <small class="muted">+ effects, live API</small></h1>
    <p class="muted">Signed in as admin@acme.test via the training interceptor. Edit <code>api/server.cjs</code>'s <code>requireRole</code> or use <code>?_fail</code> to see a rollback.</p>
    <aegis-triage-view [alerts]="visible()" [filter]="filter()" [counts]="counts()" [loading]="loading()" [error]="error()"
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
  readonly loading = this.store.selectSignal(alertsFeature.selectLoading);
  readonly error = this.store.selectSignal(alertsFeature.selectError);

  constructor() {
    this.store.dispatch(AlertsPageActions.opened());
  }
}
