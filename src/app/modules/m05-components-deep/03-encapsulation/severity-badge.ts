import { Component, input } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-severity-badge',
  template: `<span class="badge">{{ severity() }}</span><span class="note" [innerHTML]="noteHtml()"></span>`,
  styles: `
    .badge { font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 6px; }
    :host { display: inline-flex; gap: 6px; align-items: center; }
    :host(.compact) .badge { padding: 0 4px; font-size: 10px; }
    :host-context(.dark-tenant) .badge { outline: 1px solid var(--accent); }
    :host ::ng-deep b { color: var(--threat); }
  `,
})
export class SeverityBadge {
  readonly severity = input.required<Severity>();
  readonly noteHtml = input('');
}
