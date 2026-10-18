import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Action, provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject } from 'rxjs';
import { AlertsApiActions, AlertsPageActions } from '../01-store/alerts.actions';
import { alertsFeature } from '../01-store/alerts.feature';
import { loadAlerts, triageAlert, alertsEffects } from './alerts.effects';
import { ALERTS } from '../../../shared/domain/sample-data';

describe('M20.02 · effects', () => {
  let actions$: Subject<Action>;
  let http: HttpTestingController;
  let out: Action[];
  beforeEach(() => {
    actions$ = new Subject<Action>();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideMockActions(() => actions$)] });
    http = TestBed.inject(HttpTestingController);
    out = [];
  });

  it('TODO 1: Opened → GET → Load Succeeded / Failed, and keeps working after an error', () => {
    TestBed.runInInjectionContext(() => loadAlerts()).subscribe(a => out.push(a));
    actions$.next(AlertsPageActions.opened());
    http.expectOne('/api/v1/alerts').flush({ title: 'Down', status: 503, detail: 'Chaos mode dropped this request', instance: '' }, { status: 503, statusText: 'x' });
    actions$.next(AlertsPageActions.opened());
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    expect(out).toEqual([AlertsApiActions.loadFailed({ error: 'Chaos mode dropped this request' }), AlertsApiActions.loadSucceeded({ alerts: ALERTS })]);
  });

  it('TODO 1: a second Opened cancels the first load (switchMap)', () => {
    TestBed.runInInjectionContext(() => loadAlerts()).subscribe(a => out.push(a));
    actions$.next(AlertsPageActions.opened());
    actions$.next(AlertsPageActions.opened());
    const [first, second] = http.match('/api/v1/alerts');
    expect(first.cancelled).toBe(true);
    second.flush([]);
    expect(out.length).toBe(1);
  });

  it('TODO 2: triage PATCHes in parallel (mergeMap) and maps both outcomes', () => {
    TestBed.runInInjectionContext(() => triageAlert()).subscribe(a => out.push(a));
    actions$.next(AlertsPageActions.triageClicked({ id: 1, status: 'TRIAGED', previous: 'NEW' }));
    actions$.next(AlertsPageActions.triageClicked({ id: 3, status: 'RESOLVED', previous: 'NEW' }));
    const r1 = http.expectOne({ method: 'PATCH', url: '/api/v1/alerts/1' });
    const r3 = http.expectOne({ method: 'PATCH', url: '/api/v1/alerts/3' });
    expect(r1.cancelled).toBe(false);
    expect(r1.request.body).toEqual({ status: 'TRIAGED' });
    r3.flush({ title: 'Forbidden', status: 403, detail: 'Requires role ADMIN or ANALYST', instance: '' }, { status: 403, statusText: 'x' });
    r1.flush({ ...ALERTS[0], status: 'TRIAGED' });
    expect(out).toEqual([
      AlertsApiActions.triageFailed({ id: 3, previous: 'NEW', error: 'Requires role ADMIN or ANALYST' }),
      AlertsApiActions.triageSucceeded({ alert: { ...ALERTS[0], status: 'TRIAGED' } }),
    ]);
  });
});

describe('M20.02 · the whole loop', () => {
  it('store + effects + reducer: a failed triage rolls back', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideStore(), provideState(alertsFeature), provideEffects(alertsEffects)],
    });
    const store = TestBed.inject(Store);
    const http = TestBed.inject(HttpTestingController);
    store.dispatch(AlertsPageActions.opened());
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    store.dispatch(AlertsPageActions.triageClicked({ id: 1, status: 'RESOLVED', previous: 'NEW' }));
    expect(store.selectSignal(alertsFeature.selectAlerts)()[0].status).toBe('RESOLVED');
    http.expectOne('/api/v1/alerts/1').flush(null, { status: 500, statusText: 'x' });
    expect(store.selectSignal(alertsFeature.selectAlerts)()[0].status).toBe('NEW');
    expect(store.selectSignal(alertsFeature.selectError)()).toContain('500');
  });
});
