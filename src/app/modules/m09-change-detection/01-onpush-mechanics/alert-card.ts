import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Alert } from '../../../shared/domain/models';

// OnPush is the v22 default, so there's nothing to declare.
@Component({
  selector: 'aegis-alert-card',
  template: `
    <article class="card alert-card" [attr.data-status]="alert().status">
      <h3>{{ alert().title }}</h3>
      <p class="status">Status: {{ alert().status }}</p>
      <p class="seen muted">seen {{ secondsAgo() }} s ago</p>
    </article>
  `,
})
export class AlertCard {
  readonly alert = input.required<Alert>();
  readonly secondsAgo = signal(0);

  constructor() {
    const id = setInterval(() => this.secondsAgo.update(s => s + 1), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
