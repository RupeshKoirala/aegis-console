// Done for you: the component under test in 01 and 02. It has ONE planted bug (01 asks you to find it with a test).
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { IndicatorView } from '../../shared/domain/models';

export type SortKey = 'value' | 'score';

@Component({
  selector: 'aegis-indicator-table',
  template: `
    <input class="filter" placeholder="Filter…" [value]="query()" (input)="query.set($any($event.target).value)" />
    <table>
      <thead><tr>
        <th><button class="sort" data-col="value" (click)="sortBy('value')">Value {{ arrow('value') }}</button></th>
        <th><button class="sort" data-col="score" (click)="sortBy('score')">Score {{ arrow('score') }}</button></th>
        <th></th>
      </tr></thead>
      <tbody>
        @for (r of view(); track r.id) {
          <tr class="row" [attr.data-id]="r.id">
            <td class="value mono">{{ r.value }}</td><td class="score">{{ r.score ?? '–' }}</td>
            <td>
              <button class="copy" (click)="copy(r.value)">copy</button>
              @if (canDelete()) { <button class="remove danger" (click)="remove.emit(r.id)">remove</button> }
            </td>
          </tr>
        } @empty { <tr class="empty"><td colspan="3">No indicators match.</td></tr> }
      </tbody>
    </table>
    <small class="muted copied">{{ copied() ? 'Copied ' + copied() : '' }}</small>
  `,
  styles: `table { width: 100%; border-collapse: collapse; } td, th { padding: 4px 8px; text-align: left; }`,
})
export class IndicatorTable {
  private readonly clipboard = inject(Clipboard);
  readonly rows = input.required<IndicatorView[]>();
  readonly canDelete = input(false);
  readonly remove = output<number>();
  readonly query = signal('');
  readonly sort = signal<{ key: SortKey; dir: 1 | -1 }>({ key: 'value', dir: 1 });
  readonly copied = signal<string | null>(null);

  readonly view = computed(() => {
    const q = this.query().trim();
//@@sol
    const rows = this.rows().filter(r => r.value.toLowerCase().includes(q.toLowerCase()));
//@@stub
    const rows = this.rows().filter(r => r.value.includes(q));
//@@end
    const { key, dir } = this.sort();
    return [...rows].sort((a, b) => {
      const x = key === 'score' ? (a.score ?? -1) : a.value;
      const y = key === 'score' ? (b.score ?? -1) : b.value;
      return (x < y ? -1 : x > y ? 1 : 0) * dir;
    });
  });

  sortBy(key: SortKey) {
    this.sort.update(s => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  }
  arrow(key: SortKey) {
    return this.sort().key !== key ? '' : this.sort().dir === 1 ? '▲' : '▼';
  }
  copy(value: string) {
    if (this.clipboard.copy(value)) this.copied.set(value);
  }
}
