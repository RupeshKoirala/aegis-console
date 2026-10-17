import { Component, effect, inject, signal } from '@angular/core';
import { ListsApi } from './lists-api';
import { IndicatorView, ListView } from '../../../shared/domain/models';

@Component({
  selector: 'app-m12-01',
  templateUrl: './page.html',
  styles: `.split { display: grid; grid-template-columns: 260px 1fr; gap: 16px; align-items: start; } .list { cursor: pointer; padding: 6px; } .list.on { color: var(--accent-2); } table.card { padding: 0; }`,
})
export class Page {
  private readonly api = inject(ListsApi);
  readonly lists = signal<ListView[]>([]);
  readonly listId = signal<number | null>(null);
  readonly query = signal('');
  readonly page = signal(0);
  readonly rows = signal<IndicatorView[]>([]);
  readonly total = signal(0);

  constructor() {
    this.api.lists().subscribe(lists => {
      this.lists.set(lists);
      this.listId.set(lists[0]?.id ?? null);
    });

    effect(() => {
      const id = this.listId();
      if (id === null) return;
      this.api.indicators(id, { q: this.query(), page: this.page(), size: 10 }).subscribe(p => {
        this.rows.set(p.items);
        this.total.set(p.total);
      });
    });
  }

  pick(id: number) {
    this.listId.set(id);
    this.page.set(0);
  }
}
