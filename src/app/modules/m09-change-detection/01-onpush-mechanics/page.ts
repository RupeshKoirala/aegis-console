import { Component } from '@angular/core';
import { AlertCard } from './alert-card';
import { ALERTS } from '../../../shared/domain/sample-data';
import { Alert } from '../../../shared/domain/models';

@Component({
  selector: 'app-m09-01',
  imports: [AlertCard],
  template: `
    <h1>Why is the card stale?</h1>
    <aegis-alert-card [alert]="alert" />
    <button class="resolve" (click)="resolve()">Resolve</button>
  `,
})
export class Page {
  // A plain field on purpose: the bug is about object mutation, not signals.
  alert: Alert = { ...ALERTS[0] };

  resolve() {
    // TODO 1: this MUTATES the object the OnPush card already has. Create a new object instead: { ...this.alert, status: 'RESOLVED' }
    this.alert.status = 'RESOLVED';
  }
}
