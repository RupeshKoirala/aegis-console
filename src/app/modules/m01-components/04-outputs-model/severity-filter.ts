import { Component, model } from '@angular/core';
import { Severity } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-severity-filter',
  template: `
    <div class="chips" role="group" aria-label="Filter by severity">
      @for (s of all; track s) {
        <button class="chip sev" [class]="s" [class.on]="selected().includes(s)" (click)="toggle(s)">{{ s }}</button>
      }
    </div>
  `,
  styles: `
    .chips { display: flex; gap: 6px; }
    .chip { font-size: 12px; padding: 4px 10px; border-radius: 999px; opacity: .55; }
    .chip.on { opacity: 1; border-color: currentColor; background: rgba(255,255,255,.05); }
  `,
})
export class SeverityFilter {
  protected readonly all: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  readonly selected = model<Severity[]>([]);

  toggle(s: Severity) {
    this.selected.update(cur => (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]));
  }
}
