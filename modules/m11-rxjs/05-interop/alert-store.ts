import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ALERTS } from '../../../shared/domain/sample-data';
import { Alert } from '../../../shared/domain/models';

/** Gen 1 store: state in a BehaviorSubject, exposed as Observables. Don't change it. */
@Injectable({ providedIn: 'root' })
export class AlertStore {
  private readonly state = new BehaviorSubject<Alert[]>(ALERTS);
  readonly alerts$: Observable<Alert[]> = this.state.asObservable();
  readonly observers = () => this.state.observers.length;

  byStatus$(status: Alert['status'] | 'ALL'): Observable<Alert[]> {
    return this.alerts$.pipe(map(list => (status === 'ALL' ? list : list.filter(a => a.status === status))));
  }

  resolve(id: number) {
    this.state.next(this.state.value.map(a => (a.id === id ? { ...a, status: 'RESOLVED' as const } : a)));
  }
}
