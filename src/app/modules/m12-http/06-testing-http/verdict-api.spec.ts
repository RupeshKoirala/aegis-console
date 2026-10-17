import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VerdictApi, VerdictResult } from './verdict-api';

const verdict = { query: '203.0.113.66', type: 'IP', verdict: 'BLOCK', reason: 'THREAT_SCORE', threshold: 90, matches: [], engine: 'fake' } as const;

describe('M12.06 · testing VerdictApi (written by you)', () => {
  let http: HttpTestingController;
  let api: VerdictApi;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    api = TestBed.inject(VerdictApi);
  });
  afterEach(() => http.verify());

  it('GETs /api/v1/verdict with a trimmed, lower-cased q', () => {
    api.check('  WWW.Evil.Example ').subscribe();
    const req = http.expectOne(r => r.url === '/api/v1/verdict');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('www.evil.example');
    req.flush(verdict);
  });

  it('maps a 200 to { kind: "ok", verdict }', () => {
    let result: VerdictResult | undefined;
    api.check('203.0.113.66').subscribe(r => (result = r));
    http.expectOne(r => r.url === '/api/v1/verdict').flush(verdict);
    expect(result).toEqual({ kind: 'ok', verdict });
  });

  it('does not call the server for a blank query', () => {
    let result: VerdictResult | undefined;
    api.check('   ').subscribe(r => (result = r));
    http.expectNone(() => true);
    expect(result).toEqual({ kind: 'invalid', message: 'Enter an IP or domain' });
  });

  it('maps a 400 problem to { kind: "invalid", message: detail }', () => {
    let result: VerdictResult | undefined;
    api.check('10.0.0.0/8').subscribe(r => (result = r));
    http.expectOne(r => r.url === '/api/v1/verdict').flush(
      { title: 'Bad Request', status: 400, detail: 'A verdict is for one IP address or domain, not a CIDR block' },
      { status: 400, statusText: 'Bad Request' });
    expect(result).toEqual({ kind: 'invalid', message: 'A verdict is for one IP address or domain, not a CIDR block' });
  });

  it('rethrows other errors (500, network)', () => {
    const errors: number[] = [];
    api.check('a.example').subscribe({ error: e => errors.push(e.status) });
    http.expectOne(r => r.url === '/api/v1/verdict').flush(null, { status: 500, statusText: 'Server Error' });
    api.check('b.example').subscribe({ error: e => errors.push(e.status) });
    http.expectOne(r => r.url === '/api/v1/verdict').error(new ProgressEvent('error'));
    expect(errors).toEqual([500, 0]);
  });
});
