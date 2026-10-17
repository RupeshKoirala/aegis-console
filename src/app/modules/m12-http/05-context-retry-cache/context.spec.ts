import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CACHE_TTL, cachingInterceptor, clearHttpCache, retryInterceptor } from './interceptors';

describe('M12.05 · context, retry, cache', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  beforeEach(() => {
    clearHttpCache();
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([cachingInterceptor, retryInterceptor])), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });
  afterEach(() => vi.useRealTimers());

  it('TODO 1: caches GETs that ask for it, for the TTL', () => {
    vi.useFakeTimers();
    const ctx = new HttpContext().set(CACHE_TTL, 1000);
    const got: unknown[] = [];
    client.get('/api/v1/lists', { context: ctx }).subscribe(r => got.push(r));
    http.expectOne('/api/v1/lists').flush(['a']);
    client.get('/api/v1/lists', { context: ctx }).subscribe(r => got.push(r));
    http.expectNone('/api/v1/lists');
    vi.advanceTimersByTime(1500);
    client.get('/api/v1/lists', { context: ctx }).subscribe(r => got.push(r));
    http.expectOne('/api/v1/lists').flush(['b']);
    expect(got).toEqual([['a'], ['a'], ['b']]);
    client.get('/api/v1/lists').subscribe();
    http.expectOne('/api/v1/lists').flush([]);
  });

  it('TODO 2: retries GET twice on 503 with growing delay', () => {
    vi.useFakeTimers();
    let result: unknown;
    client.get('/api/v1/lists').subscribe(r => (result = r));
    http.expectOne('/api/v1/lists').flush(null, { status: 503, statusText: 'Unavailable' });
    vi.advanceTimersByTime(300);
    http.expectOne('/api/v1/lists').flush(null, { status: 503, statusText: 'Unavailable' });
    vi.advanceTimersByTime(599);
    http.expectNone('/api/v1/lists');
    vi.advanceTimersByTime(1);
    http.expectOne('/api/v1/lists').flush(['ok']);
    expect(result).toEqual(['ok']);
  });

  it('TODO 2: never retries 4xx or POST', () => {
    vi.useFakeTimers();
    let errors = 0;
    client.get('/api/v1/lists/999').subscribe({ error: () => errors++ });
    http.expectOne('/api/v1/lists/999').flush(null, { status: 404, statusText: 'Not Found' });
    client.post('/api/v1/lists', {}).subscribe({ error: () => errors++ });
    http.expectOne('/api/v1/lists').flush(null, { status: 503, statusText: 'Unavailable' });
    vi.advanceTimersByTime(2000);
    http.expectNone(() => true);
    expect(errors).toBe(2);
  });
});
