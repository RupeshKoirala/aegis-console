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
    // TODO 3: load the lists once; store them in `lists` and select the first one (listId)
    // TODO 4: an effect that re-loads the indicators whenever listId(), query() or page() changes
    //         (skip when listId() is null) and stores items in `rows` and total in `total`
  }

  pick(id: number) {
    this.listId.set(id);
    this.page.set(0);
  }
}
