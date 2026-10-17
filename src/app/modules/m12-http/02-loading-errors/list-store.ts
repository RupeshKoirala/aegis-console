import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ListView, Problem } from '../../../shared/domain/models';
import { toProblem } from './problem';

@Injectable({ providedIn: 'root' })
export class ListStore {
  private readonly http = inject(HttpClient);
  readonly items = signal<ListView[]>([]);
  readonly loading = signal(false);
  readonly error = signal<Problem | null>(null);
  readonly empty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

  /** `simulate` appends the fake API's teaching switches, e.g. "_fail=500" or "_delay=1500". */
  load(simulate = '') {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<ListView[]>(`/api/v1/lists${simulate ? '?' + simulate : ''}`).subscribe({
      next: items => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(toProblem(err));
        this.loading.set(false);
      },
    });
  }
}
