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
//@@sol
    this.saving.set(true);
    this.error.set(null);
    this.http.post<IndicatorView>(base, request).subscribe({
      next: created => {
        this.items.update(list => [created, ...list]);
        this.saving.set(false);
      },
      error: err => {
        this.error.set(toProblem(err));
        this.saving.set(false);
      },
    });
//@@stub
    // TODO 1: POST the request to `base`. saving is true while in flight and the old error is cleared.
    //         On 201, PREPEND the created IndicatorView. On error, store toProblem(err).
//@@end
  }

  remove(id: number) {
//@@sol
    const snapshot = this.items();
    this.error.set(null);
    this.items.update(list => list.filter(i => i.id !== id));
    this.http.delete<void>(`${base}/${id}`).subscribe({
      error: err => {
        this.items.set(snapshot);
        this.error.set(toProblem(err));
      },
    });
//@@stub
    // TODO 2: optimistic: remember the current items, remove the row immediately, then DELETE `${base}/${id}`
    // TODO 3: on error restore the snapshot (same order) and store toProblem(err)
//@@end
  }
}
