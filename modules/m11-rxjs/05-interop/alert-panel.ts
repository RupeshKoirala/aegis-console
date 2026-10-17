import { Component, inject, signal } from '@angular/core';
//@@sol
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
//@@stub
import { toSignal } from '@angular/core/rxjs-interop';
//@@end
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

//@@sol
  readonly visible = toSignal(toObservable(this.status).pipe(switchMap(s => this.store.byStatus$(s))), { initialValue: [] });

  constructor() {
    let previous = new Set<number>();
    this.store.alerts$.pipe(takeUntilDestroyed()).subscribe(list => {
      const resolved = new Set(list.filter(a => a.status === 'RESOLVED').map(a => a.id));
      if (previous.size) this.resolvedCount.update(n => n + [...resolved].filter(id => !previous.has(id)).length);
      previous = resolved;
    });
  }
//@@stub
  // TODO 1: visible should follow the status signal: turn status into an Observable (toObservable),
  //         switchMap it to store.byStatus$(s), then back into a signal with toSignal(…, { initialValue: [] }).
  readonly visible = toSignal(this.store.byStatus$('ALL'), { initialValue: [] });

  constructor() {
    // TODO 2: subscribe to store.alerts$ and count alerts that BECOME resolved after the first emission
    //         (compare the set of RESOLVED ids with the previous emission and add the new ones to resolvedCount)
    // TODO 3: the subscription must end when this component is destroyed: pipe(takeUntilDestroyed()) before subscribe
  }
//@@end
}
