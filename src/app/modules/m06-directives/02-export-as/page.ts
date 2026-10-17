import { Component } from '@angular/core';
import { CopyDirective } from './copy.directive';
import { INDICATORS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-m06-02',
  imports: [CopyDirective],
  template: `
    <h1>Copy indicators</h1>
    <ul class="card list">
      @for (i of indicators; track i.id) {
        <li class="row">
          <span class="mono">{{ i.value }}</span>
          <button class="copy" [aegisCopy]="i.value" #c="aegisCopy">{{ c.copied() ? '✓ Copied' : 'Copy' }}</button>
        </li>
      }
    </ul>
  `,
  styles: `.list { list-style: none; } li { justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border); }`,
})
export class Page {
  protected readonly indicators = INDICATORS.slice(0, 6);
}
