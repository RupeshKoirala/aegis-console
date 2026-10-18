import { Component, signal } from '@angular/core';
import { IndicatorTable } from '../indicator-table';
import { INDICATORS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-m22-01',
  imports: [IndicatorTable],
  template: `
    <h1>Write the tests <small class="muted">component, mocks, outputs</small></h1>
    <p class="muted">The work is in <code>01-write-tests/mine.spec.ts</code>. This is the component you're testing (try filtering "EVIL").</p>
    <aegis-indicator-table class="card" [rows]="rows()" [canDelete]="true" (remove)="rows.set(rows().filter(r => r.id !== $event))" />
  `,
})
export class Page {
  readonly rows = signal(INDICATORS);
}
