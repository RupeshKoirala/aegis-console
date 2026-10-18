import { TestBed } from '@angular/core/testing';
import { provideState, provideStore, Store } from '@ngrx/store';
import { AlertsApiActions, AlertsPageActions } from './alerts.actions';
import { alertsFeature, initialState } from './alerts.feature';
import { Page } from './page';
import { ALERTS } from '../../../shared/domain/sample-data';

const reduce = alertsFeature.reducer;
const loaded = reduce(initialState, AlertsApiActions.loadSucceeded({ alerts: ALERTS }));

describe('M20.01 · NgRx store', () => {
  it('TODO 1: loading lifecycle', () => {
    const opening = reduce({ ...initialState, error: 'old' }, AlertsPageActions.opened());
    expect(opening).toMatchObject({ loading: true, error: null });
    expect(reduce(opening, AlertsApiActions.loadSucceeded({ alerts: ALERTS }))).toMatchObject({ alerts: ALERTS, loading: false });
    expect(reduce(opening, AlertsApiActions.loadFailed({ error: 'boom' }))).toMatchObject({ error: 'boom', loading: false });
  });

  it('TODO 1: triage is optimistic, reversible, and never mutates', () => {
    const before = loaded.alerts;
    const clicked = reduce(loaded, AlertsPageActions.triageClicked({ id: 1, status: 'TRIAGED', previous: 'NEW' }));
    expect(clicked.alerts.find(a => a.id === 1)?.status).toBe('TRIAGED');
    expect(before.find(a => a.id === 1)?.status).toBe('NEW');
    expect(clicked.alerts[1]).toBe(before[1]);
    const failed = reduce(clicked, AlertsApiActions.triageFailed({ id: 1, previous: 'NEW', error: 'Requires role ADMIN or ANALYST' }));
    expect(failed.alerts.find(a => a.id === 1)?.status).toBe('NEW');
    expect(failed.error).toBe('Requires role ADMIN or ANALYST');
    const server = { ...ALERTS[0], status: 'TRIAGED' as const, assignee: 'ana@acme.test' };
    expect(reduce(clicked, AlertsApiActions.triageSucceeded({ alert: server })).alerts[0]).toEqual(server);
  });

  it('TODO 2: selectors derive the view', () => {
    const state = { alerts: reduce(loaded, AlertsPageActions.filterChanged({ filter: 'NEW' })) };
    expect(alertsFeature.selectVisible(state).every(a => a.status === 'NEW')).toBe(true);
    expect(alertsFeature.selectVisible(state).length).toBe(ALERTS.filter(a => a.status === 'NEW').length);
    expect(alertsFeature.selectCounts(state)).toEqual({
      NEW: ALERTS.filter(a => a.status === 'NEW').length,
      TRIAGED: ALERTS.filter(a => a.status === 'TRIAGED').length,
      RESOLVED: ALERTS.filter(a => a.status === 'RESOLVED').length,
    });
    expect(alertsFeature.selectVisible(state)).toBe(alertsFeature.selectVisible(state));
  });

  it('TODO 1 + 2: the page works through the store', async () => {
    TestBed.configureTestingModule({ providers: [provideStore(), provideState(alertsFeature)] });
    const f = TestBed.createComponent(Page);
    f.autoDetectChanges();
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelectorAll('.alert-row').length).toBe(ALERTS.length);
    (el.querySelectorAll('button.filter')[1] as HTMLButtonElement).click();
    await f.whenStable();
    expect([...el.querySelectorAll('.status')].every(s => s.textContent === 'NEW')).toBe(true);
    TestBed.inject(Store);
  });
});
