import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListsApi } from './lists-api';
import { Page } from './page';
import { LISTS, INDICATORS } from '../../../shared/domain/sample-data';

describe('M12.01 · typed GET', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('TODO 1: lists() GETs /api/v1/lists', () => {
    let out: unknown;
    TestBed.inject(ListsApi).lists().subscribe(l => (out = l));
    http.expectOne({ method: 'GET', url: '/api/v1/lists' }).flush(LISTS);
    expect(out).toEqual(LISTS);
  });

  it('TODO 2: indicators() sends page/size and only a non-empty q', () => {
    const api = TestBed.inject(ListsApi);
    api.indicators(3, { q: '  bot ', page: 2, size: 5 }).subscribe();
    const r1 = http.expectOne(r => r.url === '/api/v1/lists/3/indicators');
    expect(r1.request.params.get('q')).toBe('bot');
    expect(r1.request.params.get('page')).toBe('2');
    expect(r1.request.params.get('size')).toBe('5');
    r1.flush({ items: [], page: 2, size: 5, total: 0 });
    api.indicators(3, { q: '   ' }).subscribe();
    const r2 = http.expectOne(r => r.url === '/api/v1/lists/3/indicators');
    expect(r2.request.params.has('q')).toBe(false);
    expect(r2.request.params.get('page')).toBe('0');
    expect(r2.request.params.get('size')).toBe('10');
    r2.flush({ items: [], page: 0, size: 10, total: 0 });
  });

  it('TODO 3–4: the page loads lists, then the first list, and re-loads on search', async () => {
    const f = TestBed.createComponent(Page);
    f.detectChanges();
    http.expectOne('/api/v1/lists').flush(LISTS);
    await f.whenStable();
    http.expectOne(r => r.url === '/api/v1/lists/1/indicators').flush({ items: INDICATORS.slice(0, 2), page: 0, size: 10, total: 2 });
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('tr.ind-row').length).toBe(2);
    f.componentInstance.query.set('192');
    await f.whenStable();
    const req = http.expectOne(r => r.url === '/api/v1/lists/1/indicators');
    expect(req.request.params.get('q')).toBe('192');
    req.flush({ items: [], page: 0, size: 10, total: 0 });
  });
});
