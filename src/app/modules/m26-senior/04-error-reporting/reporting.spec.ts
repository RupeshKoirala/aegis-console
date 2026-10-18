import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CLOCK, ClientErrorReport, ErrorReporter, RELEASE, REPORT_SINK, scrub } from './error-reporter';

const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwicm9sZSI6IkFETUlOIn0.c2lnbmF0dXJlLXZhbHVlLXg';

describe('M26.04 · error reporting', () => {
  let sent: ClientErrorReport[];
  let now: number;
  let handler: ErrorHandler;
  beforeEach(() => {
    sent = [];
    now = Date.UTC(2026, 9, 15, 12);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorHandler, useClass: ErrorReporter },
        { provide: REPORT_SINK, useValue: (r: ClientErrorReport) => sent.push(r) },
        { provide: RELEASE, useValue: '2026.10.15-abc123' },
        { provide: CLOCK, useValue: () => now },
      ],
    });
    handler = TestBed.inject(ErrorHandler);
  });
  afterEach(() => vi.restoreAllMocks());

  it('TODO 1: scrub removes tokens, JWTs, emails and token params', () => {
    expect(scrub(`Authorization: Bearer ${JWT}`)).toBe('Authorization: Bearer [redacted]');
    expect(scrub(`token was ${JWT} oops`)).toBe('token was [jwt] oops');
    expect(scrub('user ana.lyst+soc@acme.test failed')).toBe('user [email] failed');
    expect(scrub('GET /events/stream?access_token=abc.def&x=1')).toBe('GET /events/stream?access_token=[redacted]&x=1');
  });

  it('TODO 2: runtime errors become scrubbed reports', () => {
    handler.handleError(new Error('refresh failed for ana@acme.test'));
    expect(sent).toEqual([{ kind: 'runtime', message: 'refresh failed for [email]', url: location.pathname, release: '2026.10.15-abc123', at: '2026-10-15T12:00:00.000Z' }]);
    expect(console.error).toHaveBeenCalledOnce();
  });

  it('TODO 2: HTTP errors carry status and the correlation id', () => {
    handler.handleError(new HttpErrorResponse({ status: 503, url: '/api/v1/alerts', headers: new HttpHeaders({ 'X-Correlation-Id': 'c0ffee-42' }) }));
    expect(sent[0]).toMatchObject({ kind: 'http', status: 503, message: '503 /api/v1/alerts', correlationId: 'c0ffee-42' });
  });

  it('TODO 2: the same message is sent once per minute', () => {
    for (let i = 0; i < 5; i++) handler.handleError(new Error('poll failed'));
    now += 59_000;
    handler.handleError(new Error('poll failed'));
    handler.handleError(new Error('something else'));
    now += 2_000;
    handler.handleError(new Error('poll failed'));
    expect(sent.map(r => r.message)).toEqual(['poll failed', 'something else', 'poll failed']);
    expect(console.error).toHaveBeenCalledTimes(8);
  });
});
