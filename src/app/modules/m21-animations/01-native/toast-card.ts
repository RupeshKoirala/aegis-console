import { Component, input, output } from '@angular/core';
import { Severity } from '../../../shared/domain/models';
import { slideOut } from './motion';

@Component({
  selector: 'aegis-toast-card',
  host: {
    class: 'toast card',
    '[attr.data-severity]': 'severity()',
    'animate.enter': 'toast-in',
    '(animate.leave)': 'leave($event)',
  },
  template: `<span class="badge">{{ severity() }}</span> {{ message() }} <button class="close" (click)="dismiss.emit()">✕</button>`,
  styles: `
    :host { display: flex; gap: 8px; align-items: center; }
    :host(.toast-in) { animation: toast-in 250ms cubic-bezier(.2, .8, .2, 1); }
    @keyframes toast-in { from { opacity: 0; transform: translateY(-12px) scale(.98); } }
    @media (prefers-reduced-motion: reduce) { :host(.toast-in) { animation: none; } }
  `,
})
export class ToastCard {
  readonly severity = input.required<Severity>();
  readonly message = input.required<string>();
  readonly dismiss = output<void>();
  protected readonly leave = slideOut;
}
