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
    // TODO: call api.check('  WWW.Evil.Example '), expectOne the request, assert method GET and q === 'www.evil.example', flush
    expect.fail('TODO: write this test');
  });

  it('maps a 200 to { kind: "ok", verdict }', () => {
    expect.fail('TODO: subscribe, flush `verdict`, assert the mapped result');
  });

  it('does not call the server for a blank query', () => {
    expect.fail('TODO: check("   ") → http.expectNone(...) and result { kind: "invalid", message: "Enter an IP or domain" }');
  });

  it('maps a 400 problem to { kind: "invalid", message: detail }', () => {
    expect.fail('TODO: flush a problem body with { status: 400, statusText: "Bad Request" }');
  });

  it('rethrows other errors (500, network)', () => {
    expect.fail('TODO: one 500 via flush(null, { status: 500 … }) and one network error via req.error(new ProgressEvent("error"))');
  });
});
