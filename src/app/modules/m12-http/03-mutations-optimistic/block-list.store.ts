import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CreateIndicatorRequest, IndicatorView, Page, Problem } from '../../../shared/domain/models';
import { toProblem } from './problem';

export const LIST_ID = 2;
const base = `/api/v1/lists/${LIST_ID}/indicators`;

@Injectable({ providedIn: 'root' })
export class BlockListStore {
  private readonly http = inject(HttpClient);
  readonly items = signal<IndicatorView[]>([]);
  readonly error = signal<Problem | null>(null);
  readonly saving = signal(false);

  load() {
    this.http.get<Page<IndicatorView>>(base, { params: { size: 200 } }).subscribe(p => this.items.set(p.items));
  }

  add(request: CreateIndicatorRequest) {
    // TODO 1: POST the request to `base`. saving is true while in flight and the old error is cleared.
    //         On 201, PREPEND the created IndicatorView. On error, store toProblem(err).
  }

  remove(id: number) {
    // TODO 2: optimistic: remember the current items, remove the row immediately, then DELETE `${base}/${id}`
    // TODO 3: on error restore the snapshot (same order) and store toProblem(err)
  }
}
