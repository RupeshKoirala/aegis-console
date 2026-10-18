import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ListView } from '../../../shared/domain/models';
import { InvestigationStore } from './investigation.store';

@Component({
  selector: 'app-m27-list',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="../../lookup">← lookup</a>
    <h2 class="list-name">{{ list().name }} <span class="badge">{{ list().kind }}</span></h2>
    <p class="muted">{{ list().description }}</p>

    @if (store.canEdit()) {
      <form class="row card add" [formGroup]="form" (ngSubmit)="add()">
        <input class="value mono" formControlName="value" placeholder="IP, CIDR or domain" />
        <input class="description" formControlName="description" placeholder="why?" />
        <button class="primary" [disabled]="form.invalid || store.saving()">Add</button>
      </form>
      @if (store.addErrors()['value']; as e) { <p class="error-text value-error">{{ e }}</p> }
      @if (store.addErrors()['_']; as e) { <p class="error-text add-error">{{ e }}</p> }
    } @else {
      <p class="muted read-only">Read-only access: you can investigate but not change lists.</p>
    }

    <input class="filter" placeholder="filter…" [value]="store.query()" (input)="store.query.set($any($event.target).value)" />
    @if (store.error(); as e) { <p class="error-text list-error" role="alert">{{ e }}</p> }
    <table class="card">
      @for (i of store.indicators(); track i.id) {
        <tr class="row"><td class="mono value-cell">{{ i.value }}</td><td>{{ i.description ?? i.category }}</td>
          <td>@if (store.canEdit()) { <button class="remove danger" (click)="store.remove(i.id)">remove</button> }</td></tr>
      } @empty { <tr><td class="muted">No indicators.</td></tr> }
    </table>
  `,
  styles: `table { width: 100%; border-collapse: collapse; } td { padding: 4px 8px; border-bottom: 1px solid var(--border); } .filter { margin: 12px 0 6px; }`,
})
export class ListPage {
  /** resolved by listResolver (routes.ts) */
  readonly list = input.required<ListView>();
  protected readonly store = inject(InvestigationStore);
  readonly form = inject(FormBuilder).nonNullable.group({ value: ['', Validators.required], description: [''] });

  constructor() {
    effect(() => this.store.open(this.list()));
  }

  async add() {
    const { value, description } = this.form.getRawValue();
    if (await this.store.add({ value: value.trim(), description: description.trim() || null })) this.form.reset();
  }
}
