import { Component, computed, signal } from '@angular/core';
import { INDICATORS, listOf } from '../../../shared/domain/sample-data';
import { IndicatorView } from '../../../shared/domain/models';

@Component({
  selector: 'app-m01-01',
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  protected readonly indicators: IndicatorView[] = INDICATORS;
  protected readonly now = new Date('2026-10-30T00:00:00Z').getTime();
  protected readonly role: 'ADMIN' | 'READ_ONLY' = 'READ_ONLY';

  protected readonly index = signal(0);
  protected readonly copied = signal(false);
  protected readonly indicator = computed(() => this.indicators[this.index()]);
  protected readonly list = computed(() => listOf(this.indicator()));
  protected readonly isExpired = computed(() => {
    const e = this.indicator().expiresAt;
    return e !== null && Date.parse(e) < this.now;
  });

  next() {
    this.index.update(i => (i + 1) % this.indicators.length);
    this.copied.set(false);
  }

  previous() {
    this.index.update(i => (i - 1 + this.indicators.length) % this.indicators.length);
    this.copied.set(false);
  }

  copy() {
    navigator.clipboard?.writeText(this.indicator().value).catch(() => {});
    this.copied.set(true);
  }
}
