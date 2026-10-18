import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, debounce, distinctUntilChanged, firstValueFrom, of, switchMap, timer } from 'rxjs';
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

  /** R2: READ_ONLY users (or unknown) can't change anything */
  readonly canEdit = computed(() => !!this.me() && this.me()!.role !== 'READ_ONLY');

  constructor() {
    this.api.me().pipe(takeUntilDestroyed()).subscribe(me => this.me.set(me));
    // R3: reload whenever the list changes, or the query settles (300 ms; clearing is immediate)
    combineLatest([toObservable(this.list), toObservable(this.query).pipe(debounce(q => (q ? timer(300) : of(0))), distinctUntilChanged())])
      .pipe(
        switchMap(([list, q]) => (list ? this.api.indicators(list.id, q.trim()).pipe(catchError(() => of([] as IndicatorView[]))) : of([]))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(rows => this.indicators.set(rows));
  }

  open(list: ListView) {
    this.list.set(list);
    this.error.set(null);
    this.addErrors.set({});
  }

  /** R5: returns true when the indicator was added */
  async add(body: CreateIndicatorRequest): Promise<boolean> {
    const list = this.list();
    if (!list || !this.canEdit()) return false;
    this.saving.set(true);
    this.addErrors.set({});
    try {
      const created = await firstValueFrom(this.api.add(list.id, body));
      this.indicators.update(rows => [created, ...rows]);
      return true;
    } catch (e) {
      const p = (e as HttpErrorResponse).error as Problem | null;
      this.addErrors.set(p?.errors ?? { _: p?.detail ?? 'Could not add the indicator' });
      return false;
    } finally {
      this.saving.set(false);
    }
  }

  /** R6: optimistic, rolled back in place on failure */
  remove(id: number) {
    const list = this.list();
    if (!list || !this.canEdit()) return;
    const before = this.indicators();
    this.error.set(null);
    this.indicators.update(rows => rows.filter(r => r.id !== id));
    this.api.remove(list.id, id).subscribe({
      error: (e: HttpErrorResponse) => {
        this.indicators.set(before);
        this.error.set((e.error as Problem | null)?.detail ?? `Delete failed (${e.status})`);
      },
    });
  }
}
