import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TimingInterceptor, correlationIdInterceptor, sessionInterceptor, tenantInterceptor } from './interceptors';
import { RequestLog, SessionEvents, TenantContext } from './session';

describe('M12.04 · interceptors', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([correlationIdInterceptor, tenantInterceptor, sessionInterceptor]), withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });

  it('TODO 1: adds a fresh correlation id unless one is present', () => {
    client.get('/api/v1/lists').subscribe();
    client.get('/api/v1/lists', { headers: { 'X-Correlation-Id': 'keep-me' } }).subscribe();
    const [a, b] = http.match('/api/v1/lists');
    expect(a.request.headers.get('X-Correlation-Id')).toMatch(/^[0-9a-f-]{36}$/);
    expect(b.request.headers.get('X-Correlation-Id')).toBe('keep-me');
  });

  it('TODO 2: adds X-Tenant-Id only when acting for a tenant, only for /api/', () => {
    client.get('/api/v1/lists').subscribe();
    expect(http.expectOne('/api/v1/lists').request.headers.has('X-Tenant-Id')).toBe(false);
    TestBed.inject(TenantContext).actingFor.set(2);
    client.get('/api/v1/lists').subscribe();
    client.get('https://cdn.example/x.js').subscribe();
    expect(http.expectOne('/api/v1/lists').request.headers.get('X-Tenant-Id')).toBe('2');
    expect(http.expectOne('https://cdn.example/x.js').request.headers.has('X-Tenant-Id')).toBe(false);
  });

  it('TODO 3: a 401 flags the session and still errors', () => {
    let failed = false;
    client.get('/api/v1/me').subscribe({ error: () => (failed = true) });
    http.expectOne('/api/v1/me').flush({ title: 'Unauthorized', status: 401 }, { status: 401, statusText: 'Unauthorized' });
    expect(TestBed.inject(SessionEvents).expired()).toBe(true);
    expect(failed).toBe(true);
  });

  it('TODO 4: the class interceptor logs status and timing', () => {
    client.get('/api/v1/lists', { params: { page: 0 } }).subscribe();
    http.expectOne(r => r.url === '/api/v1/lists').flush([]);
    client.get('/api/v1/nope').subscribe({ error: () => {} });
    http.expectOne('/api/v1/nope').flush({}, { status: 404, statusText: 'Not Found' });
    const lines = TestBed.inject(RequestLog).lines();
    expect(lines[1]).toMatch(/^GET \/api\/v1\/lists\?page=0 → 200 in \d+ ms$/);
    expect(lines[0]).toMatch(/^GET \/api\/v1\/nope → 404 in \d+ ms$/);
  });
});
