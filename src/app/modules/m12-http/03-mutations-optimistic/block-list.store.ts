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
  }

  remove(id: number) {
    const snapshot = this.items();
    this.error.set(null);
    this.items.update(list => list.filter(i => i.id !== id));
    this.http.delete<void>(`${base}/${id}`).subscribe({
      error: err => {
        this.items.set(snapshot);
        this.error.set(toProblem(err));
      },
    });
  }
}
