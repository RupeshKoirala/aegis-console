import { Component, signal } from '@angular/core';
import { VerdictView } from '../../../shared/domain/models';

@Component({
  selector: 'app-m10-04',
  templateUrl: './page.html',
  styles: `.q { width: 340px; } .result { margin-top: 14px; } .result h2 { font-size: 18px; margin: 0; display: flex; gap: 10px; align-items: center; }`,
})
export class Page {
  readonly query = signal('203.0.113.66');
  readonly slow = signal(false);

  // TODO 1: an httpResource<VerdictView> that requests '/api/v1/verdict' with params { q } whenever query() changes,
  //         and does NOT request anything when the trimmed query is empty (return undefined).
  // TODO 2: when slow() is true, add the fake API's teaching switch to the params: { q, _delay: 1500 }
}
