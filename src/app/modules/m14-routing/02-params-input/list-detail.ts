import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INDICATORS, LISTS } from '../../../shared/domain/sample-data';

@Component({
  selector: 'app-list-index',
  imports: [RouterLink],
  template: `
    <h2>Lists</h2>
    <ul class="card">@for (l of lists; track l.id) { <li><a [routerLink]="[l.id]">{{ l.name }}</a></li> }</ul>
  `,
})
export class ListIndex {
  protected readonly lists = LISTS;
}

@Component({
  selector: 'app-list-detail',
  imports: [RouterLink],
  template: `
    @if (list(); as l) {
      <h2>{{ l.name }} <span class="badge">{{ l.kind }}</span></h2>
      <p class="muted">{{ l.description }}</p>
      <ul class="card">@for (i of indicators(); track i.id) { <li class="mono">{{ i.value }}</li> }</ul>
      <nav class="row">
        <a [routerLink]="['..', prevId()]" class="prev">← previous</a>
        <a [routerLink]="['..', nextId()]" class="next">next →</a>
        <a routerLink=".." class="up">all lists</a>
      </nav>
    } @else {
      <p class="error-text">List {{ listId() }} doesn't exist.</p>
    }
  `,
})
export class ListDetail {
  /** Bound from the :listId route param by withComponentInputBinding(). numberAttribute turns "2" into 2. */
  readonly listId = input.required({ transform: numberAttribute });
  readonly list = computed(() => LISTS.find(l => l.id === this.listId()));
  readonly indicators = computed(() => INDICATORS.filter(i => i.listId === this.listId()));
  private readonly index = computed(() => LISTS.findIndex(l => l.id === this.listId()));
  readonly prevId = computed(() => LISTS[(this.index() - 1 + LISTS.length) % LISTS.length].id);
  readonly nextId = computed(() => LISTS[(this.index() + 1) % LISTS.length].id);
}
