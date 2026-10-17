import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BlockListStore } from './block-list.store';
import { INDICATORS } from '../../../shared/domain/sample-data';

const url = '/api/v1/lists/2/indicators';
const rows = INDICATORS.filter(i => i.listId === 2);

describe('M12.03 · mutations', () => {
  let http: HttpTestingController;
  let store: BlockListStore;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(BlockListStore);
    store.load();
    http.expectOne(r => r.url === url && r.method === 'GET').flush({ items: rows, page: 0, size: 200, total: rows.length });
  });
  afterEach(() => http.verify());

  it('TODO 1: POST prepends the created indicator', () => {
    store.add({ value: '203.0.113.200', description: 'C2' });
    expect(store.saving()).toBe(true);
    const req = http.expectOne({ method: 'POST', url });
    expect(req.request.body).toEqual({ value: '203.0.113.200', description: 'C2' });
    req.flush({ ...rows[0], id: 99, value: '203.0.113.200' }, { status: 201, statusText: 'Created', headers: { Location: `${url}/99` } });
    expect(store.items()[0].value).toBe('203.0.113.200');
    expect(store.saving()).toBe(false);
  });

  it('TODO 1: a 409 shows the problem detail', () => {
    store.add({ value: '203.0.113.7' });
    http.expectOne({ method: 'POST', url }).flush(
      { title: 'Conflict', status: 409, detail: '203.0.113.7 is already on this list', instance: url },
      { status: 409, statusText: 'Conflict' });
    expect(store.error()?.detail).toBe('203.0.113.7 is already on this list');
    expect(store.items().length).toBe(rows.length);
  });

  it('TODO 2: remove is optimistic', () => {
    store.remove(rows[1].id);
    expect(store.items().map(i => i.id)).not.toContain(rows[1].id);
    http.expectOne({ method: 'DELETE', url: `${url}/${rows[1].id}` }).flush(null, { status: 204, statusText: 'No Content' });
    expect(store.items().length).toBe(rows.length - 1);
  });

  it('TODO 3: a failed remove rolls back in place', () => {
    store.remove(rows[1].id);
    http.expectOne({ method: 'DELETE', url: `${url}/${rows[1].id}` }).flush(
      { title: 'Forbidden', status: 403, detail: 'Requires role ADMIN or ANALYST', instance: url }, { status: 403, statusText: 'Forbidden' });
    expect(store.items().map(i => i.id)).toEqual(rows.map(i => i.id));
    expect(store.error()?.status).toBe(403);
  });
});
