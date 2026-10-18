import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
//@@sol
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, debounce, distinctUntilChanged, firstValueFrom, of, switchMap, timer } from 'rxjs';
//@@end
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

//@@sol
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
//@@stub
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
//@@end
}
