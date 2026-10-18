import { Component, inject } from '@angular/core';
import { TriageView } from '../01-store/triage-view';
import { AlertTriageStore } from './triage.store';

@Component({
  selector: 'app-m20-03',
  imports: [TriageView],
  providers: [AlertTriageStore],
  template: `
    <h1>Alert triage <small class="muted">NgRx SignalStore</small></h1>
    <aegis-triage-view [alerts]="store.visible()" [filter]="store.filter()" [counts]="store.counts()" [loading]="store.loading()" [error]="store.error()"
      (filterChange)="store.setFilter($event)" (triage)="store.triage($event.id, $event.status)" />
  `,
})
export class Page {
  protected readonly store = inject(AlertTriageStore);
}
