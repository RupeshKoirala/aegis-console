//@@sol
import { Component, computed, linkedSignal, signal } from '@angular/core';
//@@stub
import { Component, computed, signal } from '@angular/core';
//@@end
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';
import { IndicatorView } from '../../../shared/domain/models';

@Component({
  selector: 'app-m10-02',
  template: `
    <h1>Lists</h1>
    <div class="split">
      <ul class="card lists">
        @for (l of lists; track l.id) {
          <li class="list" [class.on]="l.id === listId()" (click)="listId.set(l.id)">{{ l.name }}</li>
        }
      </ul>
      <section class="card">
        <input class="q" placeholder="filter…" [value]="query()" (input)="query.set($any($event.target).value)" />
        <p class="muted">page {{ page() + 1 }}</p>
        @for (i of visible(); track i.id) {
          <p class="ind mono" [class.sel]="selected()?.id === i.id" (click)="selected.set(i)">{{ i.value }}</p>
        }
        <p class="selected">Selected: {{ selected()?.value ?? 'nothing' }}</p>
        <button class="next-page" (click)="page.set(page() + 1)">next page</button>
      </section>
    </div>
  `,
  styles: `.split { display: grid; grid-template-columns: 240px 1fr; gap: 16px; } .list, .ind { cursor: pointer; padding: 4px; } .on, .sel { color: var(--accent-2); }`,
})
export class Page {
  protected readonly lists = LISTS;
  readonly listId = signal(LISTS[0].id);
  readonly query = signal('');
  readonly visible = computed(() =>
    INDICATORS.filter(i => i.listId === this.listId() && i.value.includes(this.query().trim())),
  );

//@@sol
  readonly selected = linkedSignal<IndicatorView[], IndicatorView | null>({
    source: this.visible,
    computation: (items, previous) =>
      previous?.value && items.some(i => i.id === previous.value!.id) ? previous.value : (items[0] ?? null),
  });

  readonly page = linkedSignal(() => {
    this.listId();
    this.query();
    return 0;
  });
//@@stub
  // TODO 1: a linkedSignal over `visible`:
  //   keep the previous selection if it's still in the new items, otherwise select items[0] (or null).
  //   linkedSignal<IndicatorView[], IndicatorView | null>({ source: this.visible, computation: (items, previous) => … })
  readonly selected = signal<IndicatorView | null>(null);

  // TODO 2: page must reset to 0 whenever listId() or query() changes, yet stay writable:
  //   linkedSignal(() => { this.listId(); this.query(); return 0; })
  readonly page = signal(0);
//@@end
}
