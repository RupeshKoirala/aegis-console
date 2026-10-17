import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, I18nPluralPipe, I18nSelectPipe, JsonPipe, KeyValuePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { of } from 'rxjs';

@Component({
  selector: 'app-m07-01',
  imports: [DatePipe, DecimalPipe, PercentPipe, CurrencyPipe, SlicePipe, UpperCasePipe, TitleCasePipe, KeyValuePipe, JsonPipe, I18nPluralPipe, I18nSelectPipe, AsyncPipe],
  templateUrl: './page.html',
  styles: `dl { display: grid; grid-template-columns: 200px 1fr; gap: 8px 16px; } dt { color: var(--muted); } dd { margin: 0; }`,
})
export class Page {
  readonly alert = {
    at: '2026-10-15T11:40:00Z',
    tenant: 'acme schools',
    severity: 'critical',
    blockedConnections: 1284.5,
    capacityUsed: 0.869,
    monthlyCost: 4200,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    hits: 3,
    status: 'NEW',
    tags: { feed: 'webroot', category: 'Botnets', actor: 'unknown' },
  };
  readonly liveCount$ = of(42);
  readonly hitMap = { '=0': 'no hits', '=1': '1 hit', other: '# hits' };
  readonly statusMap = { NEW: 'New, needs triage', TRIAGED: 'Being worked on', other: 'Closed' };
}
