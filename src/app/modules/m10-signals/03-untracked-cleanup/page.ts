import { Component, effect, signal } from '@angular/core';

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
    effect(() => {
      // TODO 1: read query() (tracked) and user() with untracked(() => …) so user changes don't re-run this effect
      // TODO 2: skip empty queries; otherwise schedule analytics.push(`search "${q}" by ${who}`) after 300 ms
      // TODO 3: accept the onCleanup parameter (effect(onCleanup => …)) and clear the timer there
    });
  }
}
