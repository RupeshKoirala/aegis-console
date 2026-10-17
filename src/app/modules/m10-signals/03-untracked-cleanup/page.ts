import { Component, effect, signal, untracked } from '@angular/core';

export const analytics: string[] = [];

@Component({
  selector: 'app-m10-03',
  template: `
    <h1>Search analytics</h1>
    <input class="q" placeholder="search…" [value]="query()" (input)="query.set($any($event.target).value)" />
    <select (change)="user.set($any($event.target).value)"><option>analyst&#64;acme.test</option><option>admin&#64;acme.test</option></select>
    <p class="muted">Open the console; every logged search is pushed to <code>analytics</code>.</p>
  `,
})
export class Page {
  readonly query = signal('');
  readonly user = signal('analyst@acme.test');

  constructor() {
    effect(onCleanup => {
      const q = this.query().trim();
      const who = untracked(() => this.user());
      if (!q) return;
      const timer = setTimeout(() => analytics.push(`search "${q}" by ${who}`), 300);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
