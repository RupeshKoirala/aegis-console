import { ChangeDetectionStrategy, Component } from '@angular/core';
//@@sol
import { NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
//@@end
import { ALERTS } from '../../../shared/domain/sample-data';
import { Alert } from '../../../shared/domain/models';

type StatusFilter = 'ALL' | Alert['status'];

/** Deliberately Gen 1 style: plain fields, a getter, structural directives. */
@Component({
  selector: 'app-m01-05',
//@@sol
  imports: [NgIf, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgClass, NgStyle],
//@@stub
  // TODO 1: import the legacy directives from '@angular/common':
  //         NgIf, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgClass, NgStyle
  //         (Gen 1 code often just imports CommonModule, which bundles all of them)
  imports: [],
//@@end
  // Gen 1 apps ran with the "Default" strategy (now called Eager): every component re-checked on every event.
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  alerts: Alert[] = ALERTS;
  filter: StatusFilter = 'ALL';
  selected: Alert | null = null;
  readonly filters: StatusFilter[] = ['ALL', 'NEW', 'TRIAGED', 'RESOLVED'];
  readonly statusColors: Record<Alert['status'], string> = { NEW: '#1d4ed8', TRIAGED: '#a16207', RESOLVED: '#15803d' };

  get visibleAlerts(): Alert[] {
    return this.filter === 'ALL' ? this.alerts : this.alerts.filter(a => a.status === this.filter);
  }

  trackById(_index: number, alert: Alert): number {
    return alert.id;
  }
}
