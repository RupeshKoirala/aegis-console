import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TRACE_CHAIN, TRACE_TOKEN, traceAuth, traceLoading, traceUnauthorized } from './trace.interceptors';
import { TraceLog } from './trace-log';

function setup() {
  TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors(TRACE_CHAIN)), provideHttpClientTesting()] });
  const log = TestBed.inject(TraceLog);
  log.start();
  const http = TestBed.inject(HttpClient);
  const ctl = TestBed.inject(HttpTestingController);
  // exactly what a component does: subscribe, then the next line of code
  const call = () => {
    const sub = http.get('/api/v1/lists').subscribe({ next: () => log.add('component:next'), error: e => log.add(`component:error ${e.status}`) });
    log.add('component:after-subscribe');
    return sub;
  };
  return { log, ctl, call };
}

describe('M12.07 · trace the onion', () => {
  it('TODO 4: the chain is loading → auth → unauthorized', () => {
    expect(TRACE_CHAIN).toEqual([traceLoading, traceAuth, traceUnauthorized]);
  });

  it('TODO 1–3: success: out top-to-bottom, back bottom-to-top, finalize last', () => {
    const { log, ctl, call } = setup();
    call();
    const req = ctl.expectOne('/api/v1/lists');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${TRACE_TOKEN}`);
    expect(log.labels()).toEqual(['loading:out', 'auth:out', 'unauth:out', 'component:after-subscribe']);
    req.flush([]);
    expect(log.labels()).toEqual(['loading:out', 'auth:out', 'unauth:out', 'component:after-subscribe', 'auth:back', 'component:next', 'loading:finalize']);
  });

  it('TODO 1–3: 401: caught, rethrown, and finalize still runs', () => {
    const { log, ctl, call } = setup();
    call();
    ctl.expectOne('/api/v1/lists').flush({ detail: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    expect(log.labels()).toEqual([
      'loading:out', 'auth:out', 'unauth:out', 'component:after-subscribe',
      'unauth:caught 401', 'auth:back-error', 'component:error 401', 'loading:finalize',
    ]);
  });

  it('TODO 1: cancel: no callbacks, but finalize runs', () => {
    const { log, ctl, call } = setup();
    const sub = call();
    const req = ctl.expectOne('/api/v1/lists');
    sub.unsubscribe();
    expect(req.cancelled).toBe(true);
    expect(log.labels()).toEqual(['loading:out', 'auth:out', 'unauth:out', 'component:after-subscribe', 'loading:finalize']);
  });
});
