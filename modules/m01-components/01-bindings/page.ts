//@@sol
import { Component, computed, signal } from '@angular/core';
//@@stub
import { Component, computed } from '@angular/core';
//@@end
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

//@@sol
  protected readonly index = signal(0);
  protected readonly copied = signal(false);
  protected readonly indicator = computed(() => this.indicators[this.index()]);
//@@stub
  // TODO 1: add two writable signals: `index` starting at 0 and `copied` starting at false
  //         (protected readonly index = signal(0); …)

  // TODO 2: make `indicator` depend on the index: computed(() => this.indicators[this.index()])
  protected readonly indicator = computed(() => this.indicators[0]);
//@@end
  protected readonly list = computed(() => listOf(this.indicator()));
  protected readonly isExpired = computed(() => {
    const e = this.indicator().expiresAt;
    return e !== null && Date.parse(e) < this.now;
  });

  next() {
//@@sol
    this.index.update(i => (i + 1) % this.indicators.length);
    this.copied.set(false);
//@@stub
    // TODO 3a: move to the next indicator (wrap around to 0 after the last one), and reset `copied` to false
//@@end
  }

  previous() {
//@@sol
    this.index.update(i => (i - 1 + this.indicators.length) % this.indicators.length);
    this.copied.set(false);
//@@stub
    // TODO 3c: like next(), but backwards (from 0 wrap to the last index)
//@@end
  }

  copy() {
//@@sol
    navigator.clipboard?.writeText(this.indicator().value).catch(() => {});
    this.copied.set(true);
//@@stub
    // TODO 3b: copy the value (navigator.clipboard?.writeText(...).catch(() => {})) and set `copied` to true
//@@end
  }
}
