import { Component, computed, signal } from '@angular/core';
import { ALERTS } from '../../../shared/domain/sample-data';
import { Alert } from '../../../shared/domain/models';

// 🐞 This file and page.html contain 4 bugs between them. No hints, so use the tools.
@Component({
  selector: 'app-m04-01',
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  readonly pageSize = 3;
  readonly page = signal(0);
  readonly selected = signal<Alert | null>(null);

  readonly newestFirst = computed(() =>
//@@sol
    ALERTS.toSorted((a, b) => b.at.localeCompare(a.at)),
//@@stub
    ALERTS.sort((a, b) => b.at.localeCompare(a.at)),
//@@end
  );

//@@sol
  readonly pageCount = computed(() => Math.ceil(this.newestFirst().length / this.pageSize));
//@@stub
  readonly pageCount = computed(() => Math.floor(this.newestFirst().length / this.pageSize));
//@@end
  readonly visible = computed(() => this.newestFirst().slice(this.page() * this.pageSize, (this.page() + 1) * this.pageSize));

  readonly bySeverity = computed(() => {
    const counts: Record<string, number> = {};
    for (const a of ALERTS) counts[a.severity] = (counts[a.severity] ?? 0) + 1;
    return Object.entries(counts);
  });

  next() {
    this.page.update(p => Math.min(p + 1, this.pageCount() - 1));
  }

  prev() {
    this.page.update(p => Math.max(p - 1, 0));
  }
}
