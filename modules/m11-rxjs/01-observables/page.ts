import { Component, DestroyRef, inject, signal } from '@angular/core';
import { heartbeat, parseFeed } from './streams';

@Component({
  selector: 'app-m11-01',
  template: `
    <h1>Observables from scratch</h1>
    <p class="beat">appliance heartbeat: {{ beats() }}</p>
    <textarea class="feed mono" rows="7" cols="40" [value]="feed()" (input)="feed.set($any($event.target).value)"></textarea>
    <p><button (click)="parse()">Parse feed</button></p>
    <ul>@for (l of parsed(); track $index) { <li class="mono">{{ l }}</li> }</ul>
    @if (error()) { <p class="error-text">{{ error() }}</p> }
  `,
})
export class Page {
  readonly beats = signal(0);
  readonly feed = signal('# webroot sample\n203.0.113.66\n\nEvil.Example\n198.51.100.0/24\nnot an ioc!\n192.0.2.1');
  readonly parsed = signal<string[]>([]);
  readonly error = signal<string | null>(null);

  constructor() {
    const sub = heartbeat(1000).subscribe(n => this.beats.set(n));
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }

  parse() {
    this.parsed.set([]);
    this.error.set(null);
    parseFeed(this.feed()).subscribe({
      next: l => this.parsed.update(p => [...p, l]),
      error: (e: Error) => this.error.set(e.message),
    });
  }
}
