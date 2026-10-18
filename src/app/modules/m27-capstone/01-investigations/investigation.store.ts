import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { CreateIndicatorRequest, IndicatorView, ListView, Me, Problem } from '../../../shared/domain/models';
import { InvestigationApi } from './investigation.api';

/**
 * R2–R6: the feature's state. Provided on the feature's route (module.ts), so it lives while you're in /m27.
 * The members below are the CONTRACT the pages and the acceptance tests use: keep the names and types.
 */
@Injectable()
export class InvestigationStore {
  private readonly api = inject(InvestigationApi);
  private readonly destroyRef = inject(DestroyRef);
  readonly me = signal<Me | null>(null);
  readonly list = signal<ListView | null>(null);
  readonly query = signal('');
  readonly indicators = signal<IndicatorView[]>([]);
  readonly saving = signal(false);
  /** a general error (e.g. a failed delete), shown above the table */
  readonly error = signal<string | null>(null);
  /** errors from the last add, per field ('value', 'description'…) or '_' for a general one */
  readonly addErrors = signal<Record<string, string>>({});

  // TODO R2: canEdit (signed-in user known AND role isn't READ_ONLY). Load `me` once, in the constructor.
  readonly canEdit = computed(() => false);

  // TODO R3: whenever list() changes, or query() settles (debounce 300 ms; an EMPTY query applies immediately),
  //          load api.indicators(list.id, query.trim()) into `indicators` (latest wins; errors → []). Clean up on destroy.
  //          (toObservable + combineLatest + debounce + switchMap + takeUntilDestroyed: all from M11)
  open(list: ListView) {
    this.list.set(list);
  }

  // TODO R5: add(body) → Promise<boolean>. Only if a list is open and canEdit. saving true while running, clear addErrors.
  //          201: prepend the created indicator, return true.
  //          400 with problem.errors → addErrors = errors (e.g. { value: '…' }); other problems → { _: detail }; return false.
  async add(_body: CreateIndicatorRequest): Promise<boolean> {
    return false;
  }

  // TODO R6: remove(id) optimistically (only if canEdit); on failure restore the previous rows and set error to the problem detail.
  remove(_id: number) {}
}
