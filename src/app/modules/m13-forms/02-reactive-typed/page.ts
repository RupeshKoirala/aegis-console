import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListKind } from '../../../shared/domain/models';
import { THREAT_CATEGORIES } from '../indicator-format';
import { indicatorValidator, threatNeedsScore, uniqueOnList } from './indicator-validators';

const LIST_FOR: Record<ListKind, number> = { ALLOW: 1, BLOCK: 2, THREAT: 3 };

@Component({
  selector: 'app-m13-02',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h1>Add indicator <small class="muted">reactive, typed</small></h1>
    <form [formGroup]="form" [attr.data-status]="status()" (ngSubmit)="save()" class="card stack">
      <label>List
        <select formControlName="listKind">
          <option value="ALLOW">Partner allow list</option><option value="BLOCK">Manual blocks</option><option value="THREAT">Webroot sample (threat)</option>
        </select>
      </label>
      <label>Indicator <input class="mono" formControlName="value" /></label>
      @let v = form.controls.value;
      @if (v.pending) { <small class="muted checking">checking for duplicates…</small> }
      @if (v.invalid && v.touched) {
        <p class="error-text value-error">
          @if (v.hasError('required')) { Required. }
          @else if (v.hasError('indicator')) { "{{ v.getError('indicator').value }}" is not an IPv4, CIDR or domain. }
          @else if (v.hasError('duplicate')) { Already on this list. }
        </p>
      }
      @if (form.value.listKind === 'THREAT') {
        <div class="row">
          <label>Category <select formControlName="category"><option value="">–</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }</select></label>
          <label>Score <input type="number" formControlName="score" min="1" max="100" /></label>
        </div>
        @if (form.errors?.['threatFields']; as bad) { <p class="error-text threat-error">Threat lists need: {{ bad.join(', ') }}</p> }
      }
      <button class="primary" [disabled]="form.invalid || form.pending">Add</button>
    </form>
    @if (saved(); as s) { <pre class="card saved">{{ s | json }}</pre> }
  `,
  styles: `form { max-width: 560px; } .row label { flex: 1; }`,
})
export class Page {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  protected readonly categories = THREAT_CATEGORIES;
  readonly saved = signal<unknown>(null);
  private readonly listKind = this.fb.nonNullable.control<ListKind>('BLOCK');

  readonly form = this.fb.nonNullable.group({
    listKind: this.listKind,
    value: this.fb.nonNullable.control('', {
      validators: [Validators.required, indicatorValidator],
      asyncValidators: [uniqueOnList(this.http, () => LIST_FOR[this.listKind.value])],
      updateOn: 'blur',
    }),
    category: '',
    score: this.fb.control<number | null>(null),
  }, { validators: threatNeedsScore });

  /** OnPush: reactive-form state isn't a signal. Reading this in the template re-renders when an async validator settles. */
  protected readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  save() {
    if (this.form.invalid) return;
    const { listKind, value, category, score } = this.form.getRawValue();
    this.saved.set({ listId: LIST_FOR[listKind], value: value.trim().toLowerCase(), ...(listKind === 'THREAT' ? { category, score } : {}) });
    this.form.reset();
  }
}
