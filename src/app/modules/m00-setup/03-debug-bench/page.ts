import { Component, computed, signal } from '@angular/core';
import { RiskGauge } from './risk-gauge';
import { RISK_THRESHOLDS, TenantRisk } from './risk';

// Two bugs are planted in this file. Do NOT hunt for them by reading the code first:
// follow README.md and let the tools point at them. That is the whole exercise.
@Component({
  selector: 'app-m00-03',
  imports: [RiskGauge],
  providers: [{ provide: RISK_THRESHOLDS, useValue: { medium: 40, high: 800 } }],
  templateUrl: './page.html',
})
export class Page {
  protected readonly tenants = signal<TenantRisk[]>([
    { id: 'acme', name: 'Acme Schools', score: 35 },
    { id: 'initech', name: 'Initech', score: 55 },
    { id: 'globex', name: 'Globex Health', score: 82 },
  ]);
  protected readonly rescans = signal(0);
  protected readonly average = computed(() => {
    const list = this.tenants();
    return Math.round(list.reduce((sum, t) => sum + t.score, 0) / list.length);
  });

  rescan(id: string) {
    this.rescans.update(n => n + 1);
    const t = this.tenants().find(x => x.id === id)!;
    t.score = Math.min(100, t.score + 10);
    this.tenants.set(this.tenants());
  }
}
