import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { AlertStore } from './alert-store';
import { Alert } from '../../../shared/domain/models';

@Component({
  selector: 'aegis-alert-panel',
  template: `
    <div class="row">
      @for (s of statuses; track s) { <button class="st" [class.on]="status() === s" (click)="status.set(s)">{{ s }}</button> }
    </div>
    <ul class="card">
      @for (a of visible(); track a.id) {
        <li class="alert">{{ a.title }} <small class="muted">{{ a.status }}</small>
          @if (a.status !== 'RESOLVED') { <button class="resolve" (click)="store.resolve(a.id)">resolve</button> }</li>
      }
    </ul>
    <p class="resolved-count muted">resolved this session: {{ resolvedCount() }}</p>
  `,
})
export class AlertPanel {
  protected readonly store = inject(AlertStore);
  protected readonly statuses: (Alert['status'] | 'ALL')[] = ['ALL', 'NEW', 'TRIAGED', 'RESOLVED'];
  readonly status = signal<Alert['status'] | 'ALL'>('ALL');
  readonly resolvedCount = signal(0);

  readonly visible = toSignal(toObservable(this.status).pipe(switchMap(s => this.store.byStatus$(s))), { initialValue: [] });

  constructor() {
    let previous = new Set<number>();
    this.store.alerts$.pipe(takeUntilDestroyed()).subscribe(list => {
      const resolved = new Set(list.filter(a => a.status === 'RESOLVED').map(a => a.id));
      if (previous.size) this.resolvedCount.update(n => n + [...resolved].filter(id => !previous.has(id)).length);
      previous = resolved;
    });
  }
}
