import { Component, computed, signal } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { ListKind } from '../../../shared/domain/models';

export const runs = { filtered: 0, ids: 0, topScore: 0 };

const sameIds = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((x, i) => x === b[i]);

@Component({
  selector: 'app-m10-01',
  template: `
    <h1>The graph</h1>
    <div class="row">
      <input class="q" placeholder="filter…" [value]="query()" (input)="query.set($any($event.target).value)" />
      <select class="kind" (change)="kind.set($any($event.target).value)">
        <option value="ALL">ALL</option><option>ALLOW</option><option>BLOCK</option><option>THREAT</option>
      </select>
    </div>
    <p class="summary">{{ ids().length }} ids · top score {{ topScore() ?? '—' }}</p>
  `,
})
export class Page {
  readonly query = signal('');
  readonly kind = signal<'ALL' | ListKind>('ALL');

  readonly filtered = computed(() => {
    runs.filtered++;
    const q = this.query().trim().toLowerCase();
    const k = this.kind();
    return INDICATORS.filter(i => (k === 'ALL' || listOf(i).kind === k) && i.value.includes(q));
  });

  /** Only the ids. Downstream readers shouldn't wake up if the SAME ids come back as a new array. */
  readonly ids = computed(
    () => {
      runs.ids++;
      return this.filtered().map(i => i.id);
    },
    { equal: sameIds },
  );

  readonly topScore = computed(() => {
    runs.topScore++;
    const scores = this.ids().map(id => INDICATORS.find(i => i.id === id)!.score ?? 0);
    return scores.length ? Math.max(...scores) : null;
  });
}
