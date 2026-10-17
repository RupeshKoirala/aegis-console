import { Component, inject, signal } from '@angular/core';
import { BlockListStore } from './block-list.store';

@Component({
  selector: 'app-m12-03',
  template: `
    <h1>Manual blocks</h1>
    <form class="row card add" (submit)="$event.preventDefault(); submit()">
      <input class="value mono" placeholder="IP, CIDR or domain" [value]="value()" (input)="value.set($any($event.target).value)" />
      <input class="desc" placeholder="why?" [value]="description()" (input)="description.set($any($event.target).value)" />
      <button class="primary" [disabled]="store.saving() || !value().trim()">Block</button>
    </form>
    @if (store.error(); as p) { <p class="error-text problem" role="alert">{{ p.detail }}</p> }
    <ul class="card">
      @for (i of store.items(); track i.id) {
        <li class="row ind"><span class="mono">{{ i.value }}</span> <span class="muted">{{ i.description }}</span>
          <button class="remove danger" (click)="store.remove(i.id)">Remove</button></li>
      }
    </ul>
  `,
  styles: `.ind { justify-content: space-between; border-bottom: 1px solid var(--border); padding: 6px 0; } .add { margin-bottom: 12px; }`,
})
export class Page {
  protected readonly store = inject(BlockListStore);
  readonly value = signal('');
  readonly description = signal('');
  constructor() {
    this.store.load();
  }
  submit() {
    this.store.add({ value: this.value().trim(), description: this.description().trim() || null });
    this.value.set('');
    this.description.set('');
  }
}
