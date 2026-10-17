//@@sol
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
//@@stub
import { Component, DestroyRef, inject, input } from '@angular/core';
//@@end
import { Alert } from '../../../shared/domain/models';

// OnPush is the v22 default, so there's nothing to declare.
@Component({
  selector: 'aegis-alert-card',
  template: `
    <article class="card alert-card" [attr.data-status]="alert().status">
      <h3>{{ alert().title }}</h3>
      <p class="status">Status: {{ alert().status }}</p>
<!--@@sol-->
      <p class="seen muted">seen {{ secondsAgo() }} s ago</p>
<!--@@stub-->
      <p class="seen muted">seen {{ secondsAgo }} s ago</p>
<!--@@end-->
    </article>
  `,
})
export class AlertCard {
  readonly alert = input.required<Alert>();
//@@sol
  readonly secondsAgo = signal(0);
//@@stub
  // TODO 2: this plain field changes from a timer, which no longer triggers rendering. Make it a signal (signal(0)),
  //         update it with .update() below, and read it with () in the template.
  secondsAgo = 0;
//@@end

  constructor() {
//@@sol
    const id = setInterval(() => this.secondsAgo.update(s => s + 1), 1000);
//@@stub
    const id = setInterval(() => this.secondsAgo++, 1000);
//@@end
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
