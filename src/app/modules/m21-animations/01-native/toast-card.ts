import { Component, input, output } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-toast-card',
  host: {
    class: 'toast card',
    '[attr.data-severity]': 'severity()',
    // TODO 1: animate this element itself, from its host:
    //   'animate.enter': 'toast-in'        → Angular adds the class on insert, removes it when the CSS animation ends
    //   '(animate.leave)': 'leave($event)' → our function (TODO 3) runs on removal; Angular waits for it
  },
  template: `<span class="badge">{{ severity() }}</span> {{ message() }} <button class="close" (click)="dismiss.emit()">✕</button>`,
  styles: `
    :host { display: flex; gap: 8px; align-items: center; }
    /* TODO 2: the enter animation in CSS:
       :host(.toast-in) { animation: toast-in 250ms cubic-bezier(.2, .8, .2, 1); }
       @keyframes toast-in { from { opacity: 0; transform: translateY(-12px) scale(.98); } }
       and switch it off for prefers-reduced-motion: reduce */
  `,
})
export class ToastCard {
  readonly severity = input.required<Severity>();
  readonly message = input.required<string>();
  readonly dismiss = output<void>();
}
