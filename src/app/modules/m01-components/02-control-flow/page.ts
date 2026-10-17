import { Component, computed, signal } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { IndicatorView, ListKind } from '../../../shared/domain/models';

// Done for you. All the work is in page.html.
@Component({
  selector: 'app-m01-02',
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  protected readonly kinds: ('ALL' | ListKind)[] = ['ALL', 'ALLOW', 'BLOCK', 'THREAT'];
  readonly kindFilter = signal<'ALL' | ListKind>('ALL');
  readonly onlyScored = signal(false);
  readonly selected = signal<IndicatorView | null>(null);

  readonly visible = computed(() =>
    INDICATORS.filter(i =>
      (this.kindFilter() === 'ALL' || listOf(i).kind === this.kindFilter()) &&
      (!this.onlyScored() || i.score !== null),
    ),
  );

  protected readonly kindOf = (i: IndicatorView) => listOf(i).kind;
  protected readonly listName = (i: IndicatorView) => listOf(i).name;

  select(i: IndicatorView) {
    this.selected.set(this.selected() === i ? null : i);
  }
}
