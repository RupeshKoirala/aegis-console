import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlertTriageStore } from './triage.store';
import { ALERTS } from '../../../shared/domain/sample-data';

function setup() {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), AlertTriageStore] });
  const store = TestBed.inject(AlertTriageStore);
  const http = TestBed.inject(HttpTestingController);
  return { store, http };
}

describe('M20.03 · SignalStore', () => {
  it('TODO 2: loads on init into entities', () => {
    const { store, http } = setup();
    expect(store.loading()).toBe(true);
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    expect(store.loading()).toBe(false);
    expect(store.ids().length).toBe(ALERTS.length);
    expect(store.entityMap()[3].title).toBe(ALERTS[2].title);
  });

  it('TODO 2: a failed load sets error, and load() works again afterwards', () => {
    const { store, http } = setup();
    http.expectOne('/api/v1/alerts').flush({ title: 'x', status: 503, detail: 'Chaos mode dropped this request', instance: '' }, { status: 503, statusText: 'x' });
    expect(store.error()).toBe('Chaos mode dropped this request');
    store.load();
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    expect(store.entities().length).toBe(ALERTS.length);
  });

  it('TODO 1: visible + counts follow filter and data', () => {
    const { store, http } = setup();
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    store.setFilter('RESOLVED');
    expect(store.visible().every(a => a.status === 'RESOLVED')).toBe(true);
    expect(store.counts().NEW).toBe(ALERTS.filter(a => a.status === 'NEW').length);
  });

  it('TODO 3: optimistic triage with rollback', () => {
    const { store, http } = setup();
    http.expectOne('/api/v1/alerts').flush(ALERTS);
    store.triage(1, 'TRIAGED');
    expect(store.entityMap()[1].status).toBe('TRIAGED');
    const req = http.expectOne({ method: 'PATCH', url: '/api/v1/alerts/1' });
    expect(req.request.body).toEqual({ status: 'TRIAGED' });
    req.flush({ title: 'Forbidden', status: 403, detail: 'Requires role ADMIN or ANALYST', instance: '' }, { status: 403, statusText: 'x' });
    expect(store.entityMap()[1].status).toBe('NEW');
    expect(store.error()).toBe('Requires role ADMIN or ANALYST');
    store.triage(3, 'RESOLVED');
    http.expectOne('/api/v1/alerts/3').flush({ ...ALERTS[2], status: 'RESOLVED', assignee: 'ana@acme.test' });
    expect(store.entityMap()[3]).toMatchObject({ status: 'RESOLVED', assignee: 'ana@acme.test' });
  });
});
