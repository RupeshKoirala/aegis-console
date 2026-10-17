import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { LoginResponse, Session } from '../shared/session';

const user = { id: 1, email: 'admin@acme.test', displayName: 'Ada', role: 'ADMIN' as const, tenantId: 1, tenantName: 'Acme' };
const tokens = (n: number): LoginResponse => ({ token: `jwt-${n}`, refreshToken: `r-${n}`, expiresIn: 900, user });
const unauthorized = { title: 'Unauthorized', status: 401, detail: 'Missing, invalid or expired token', instance: '/api/v1/me' };
const as401 = { status: 401, statusText: 'Unauthorized' };

function setup(signedIn = true) {
  TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()] });
  const session = TestBed.inject(Session);
  if (signedIn) session.start(tokens(1));
  return { http: TestBed.inject(HttpClient), ctl: TestBed.inject(HttpTestingController), session };
}

describe('M15.02 · auth interceptor & refresh', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('TODO 1: attaches the bearer token to API calls only', () => {
    const { http, ctl } = setup();
    http.get('/api/v1/me').subscribe();
    http.get('/assets/i18n/en.json').subscribe();
    http.post('/api/v1/auth/login', {}).subscribe();
    expect(ctl.expectOne('/api/v1/me').request.headers.get('Authorization')).toBe('Bearer jwt-1');
    expect(ctl.expectOne('/assets/i18n/en.json').request.headers.has('Authorization')).toBe(false);
    expect(ctl.expectOne('/api/v1/auth/login').request.headers.has('Authorization')).toBe(false);
  });

  it('TODO 1: no header when signed out', () => {
    const { http, ctl } = setup(false);
    http.get('/api/v1/me').subscribe({ error: () => {} });
    expect(ctl.expectOne('/api/v1/me').request.headers.has('Authorization')).toBe(false);
  });

  it('TODO 2+3: a 401 refreshes, then retries once with the new token', () => {
    const { http, ctl, session } = setup();
    let body: unknown;
    http.get('/api/v1/me').subscribe(b => (body = b));
    ctl.expectOne('/api/v1/me').flush(unauthorized, as401);
    const refresh = ctl.expectOne({ method: 'POST', url: '/api/v1/auth/refresh' });
    expect(refresh.request.body).toEqual({ refreshToken: 'r-1' });
    refresh.flush(tokens(2));
    const retry = ctl.expectOne('/api/v1/me');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer jwt-2');
    retry.flush(user);
    expect(body).toEqual(user);
    expect(session.refreshToken()).toBe('r-2');
  });

  it('TODO 2: concurrent 401s share ONE refresh', () => {
    const { http, ctl } = setup();
    const ok: string[] = [];
    for (const u of ['/api/v1/me', '/api/v1/lists', '/api/v1/alerts']) http.get(u).subscribe(() => ok.push(u));
    for (const u of ['/api/v1/me', '/api/v1/lists', '/api/v1/alerts']) ctl.expectOne(u).flush(unauthorized, as401);
    ctl.expectOne('/api/v1/auth/refresh').flush(tokens(2));
    for (const u of ['/api/v1/me', '/api/v1/lists', '/api/v1/alerts']) {
      const r = ctl.expectOne(u);
      expect(r.request.headers.get('Authorization')).toBe('Bearer jwt-2');
      r.flush({});
    }
    expect(ok.length).toBe(3);
    // and the next 401 later starts a NEW refresh
    http.get('/api/v1/me').subscribe();
    ctl.expectOne('/api/v1/me').flush(unauthorized, as401);
    ctl.expectOne('/api/v1/auth/refresh').flush(tokens(3));
    ctl.expectOne('/api/v1/me').flush({});
  });

  it('TODO 2+3: a failed refresh signs out and surfaces the ORIGINAL 401', () => {
    const { http, ctl, session } = setup();
    let status = 0;
    http.get('/api/v1/me').subscribe({ error: e => (status = e.status) });
    ctl.expectOne('/api/v1/me').flush(unauthorized, as401);
    ctl.expectOne('/api/v1/auth/refresh').flush({ title: 'Unauthorized', status: 401, detail: 'Refresh token is invalid', instance: '' }, as401);
    expect(status).toBe(401);
    expect(session.isAuthenticated()).toBe(false);
  });

  it('TODO 3: never loops: a 401 on the retry is final; 403 is not refreshed', () => {
    const { http, ctl } = setup();
    let status = 0;
    http.get('/api/v1/me').subscribe({ error: e => (status = e.status) });
    ctl.expectOne('/api/v1/me').flush(unauthorized, as401);
    ctl.expectOne('/api/v1/auth/refresh').flush(tokens(2));
    ctl.expectOne('/api/v1/me').flush(unauthorized, as401);
    expect(status).toBe(401);
    http.delete('/api/v1/lists/1').subscribe({ error: e => (status = e.status) });
    ctl.expectOne('/api/v1/lists/1').flush({ title: 'Forbidden', status: 403, detail: 'Requires role ADMIN', instance: '' }, { status: 403, statusText: 'Forbidden' });
    expect(status).toBe(403);
  });
});
