import { Component, inject, signal } from '@angular/core';
import { VerdictApi, VerdictResult } from './verdict-api';

@Component({
  selector: 'app-m12-06',
  template: `
    <h1>Testing HTTP code</h1>
    <p class="muted">This exercise lives in <code>verdict-api.spec.ts</code>. The page just lets you try the API.</p>
    <input class="mono" [value]="q()" (input)="q.set($any($event.target).value)" /> <button (click)="run()">Check</button>
    <pre class="card mono">{{ out() }}</pre>
  `,
})
export class Page {
  private readonly api = inject(VerdictApi);
  readonly q = signal('203.0.113.66');
  readonly out = signal('');
  run() {
    this.api.check(this.q()).subscribe({ next: (r: VerdictResult) => this.out.set(JSON.stringify(r, null, 2)), error: e => this.out.set(`error ${e.status}`) });
  }
}
