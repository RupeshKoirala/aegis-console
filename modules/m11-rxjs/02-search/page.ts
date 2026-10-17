import { Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, of } from 'rxjs';
import { searchIndicators } from './search';
import { INDICATORS } from '../../../shared/domain/sample-data';

/** A fake API with random latency, so out-of-order responses would be visible without switchMap. */
const fakeApi = (q: string) => of(INDICATORS.filter(i => i.value.includes(q))).pipe(delay(100 + Math.random() * 600));

@Component({
  selector: 'app-m11-02',
  template: `
    <h1>Search</h1>
    <input class="q" placeholder="type an indicator…" [value]="query()" (input)="query.set($any($event.target).value)" />
    <ul class="card">@for (r of results(); track r.id) { <li class="mono">{{ r.value }}</li> } @empty { <li class="muted">no results</li> }</ul>
  `,
})
export class Page {
  readonly query = signal('');
  readonly results = toSignal(searchIndicators(toObservable(this.query), fakeApi), { initialValue: [] });
}
