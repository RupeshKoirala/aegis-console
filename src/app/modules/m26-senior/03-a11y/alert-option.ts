import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';
import { Alert } from '../../../shared/domain/models';

/** Done for you: one option of the listbox. Highlightable lets the CDK key manager move the "active" marker. */
@Component({
  selector: 'aegis-alert-option',
  host: {
    role: 'option',
    '[id]': "'alert-opt-' + alert().id",
    '[attr.aria-selected]': 'active()',
    '[class.active]': 'active()',
  },
  template: `<span class="badge">{{ alert().severity }}</span> {{ alert().title }} <small class="muted">{{ alert().status }}</small>`,
  styles: `:host { display: block; padding: 6px 10px; border-radius: 6px; } :host(.active) { outline: 2px solid var(--accent); }`,
})
export class AlertOption implements Highlightable {
  readonly alert = input.required<Alert>();
  readonly active = signal(false);
  readonly el = inject(ElementRef<HTMLElement>);
  setActiveStyles() { this.active.set(true); }
  setInactiveStyles() { this.active.set(false); }
}
