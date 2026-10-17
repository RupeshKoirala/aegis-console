import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ListView, Problem } from '../../../shared/domain/models';

@Injectable({ providedIn: 'root' })
export class ListStore {
  private readonly http = inject(HttpClient);
  readonly items = signal<ListView[]>([]);
  readonly loading = signal(false);
  readonly error = signal<Problem | null>(null);
  readonly empty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

  /** `simulate` appends the fake API's teaching switches, e.g. "_fail=500" or "_delay=1500". */
  load(simulate = '') {
    // TODO 2: set loading true and clear the previous error, then GET `/api/v1/lists` (+ '?' + simulate when given)
    // TODO 3: on success store items; on error store toProblem(err). Either way loading becomes false.
    //         Keep the previous items on error (stale-while-revalidate).
  }
}
