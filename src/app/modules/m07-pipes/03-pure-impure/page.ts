import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SortByPipe } from './sort-by.pipe';
import { SortByImpurePipe } from './impure-sort.pipe';

interface Item { value: string }

@Component({
  selector: 'app-m07-03',
  imports: [SortByPipe, SortByImpurePipe],
  // Eager so you can see impure pipes run on every check (OnPush would hide part of the cost).
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h1>Pure vs impure</h1>
    <div class="row">
      <button class="add-mutable" (click)="addMutable()">Add (push, mutable)</button>
      <button class="add-immutable" (click)="addImmutable()">Add (new array)</button>
      <button class="noop" (click)="noop()">Unrelated click</button>
    </div>
    <div class="cols">
      <section class="card"><h3>pure sortBy</h3>
        <ol class="pure">@for (i of items | sortBy: 'value'; track i.value) { <li class="mono">{{ i.value }}</li> }</ol></section>
      <section class="card"><h3>impure sortByImpure</h3>
        <ol class="impure">@for (i of items | sortByImpure: 'value'; track i.value) { <li class="mono">{{ i.value }}</li> }</ol></section>
    </div>
  `,
  styles: `.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }`,
})
export class Page {
  items: Item[] = [{ value: 'evil.example' }, { value: '203.0.113.7' }];
  private n = 0;
  private next(): Item { return { value: `aa-new-${++this.n}.example` }; }

  addMutable() {
    this.items.push(this.next());
  }

  addImmutable() {
    // TODO 1: add a new item WITHOUT mutating: assign a new array
    this.items.push(this.next());
  }

  noop() {
    // TODO 2: nothing to write here. Read it: this click changes no data, yet triggers change detection.
    //         Watch the impure counter go up anyway in the tests.
  }
}
