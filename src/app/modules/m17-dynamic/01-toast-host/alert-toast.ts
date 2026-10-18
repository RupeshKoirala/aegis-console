import { Component, input, output } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

/** Done for you: a toast. It knows nothing about who created it; it just has inputs and an output. */
@Component({
  selector: 'aegis-alert-toast',
  host: { class: 'toast card', '[attr.data-severity]': 'severity()', role: 'status' },
  template: `<span class="badge sev">{{ severity() }}</span> <span class="msg">{{ message() }}</span>
             <button class="close" aria-label="Dismiss" (click)="dismiss.emit()">✕</button>`,
  styles: `:host { display: flex; gap: 8px; align-items: center; min-width: 320px; }
           :host([data-severity=CRITICAL]) { border-color: #e5484d; } .msg { flex: 1; }`,
})
export class AlertToast {
  readonly severity = input.required<Severity>();
  readonly message = input.required<string>();
  readonly dismiss = output<void>();
}
