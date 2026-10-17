import { Component, computed, signal } from '@angular/core';
import { INDICATORS } from '../../../shared/domain/sample-data';
import { classify, groupBy, isExpired, label, riskLevel } from './indicator-utils';

// Done for you: a small playground that calls your functions. (Signals are explained in M01/M10.)
@Component({
  selector: 'app-m00-01',
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  protected readonly input = signal(' 203.0.113.66 ');
  protected readonly scoreInput = signal(97);
  protected readonly type = computed(() => classify(this.input()));
  protected readonly level = computed(() => riskLevel(this.scoreInput()));
  protected readonly groups = computed(() => Object.entries(groupBy(INDICATORS, i => i.type)));
  protected readonly label = label;
  protected readonly isExpired = isExpired;
  protected readonly now = new Date('2026-10-30T00:00:00Z');
}
