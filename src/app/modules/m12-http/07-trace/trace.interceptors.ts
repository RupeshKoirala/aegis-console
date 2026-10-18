import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TraceLog } from './trace-log';

/** The token the fake API accepts as admin@acme.test (the training shortcut from M12). */
export const TRACE_TOKEN = 'dev:admin@acme.test';

/**
 * Each interceptor writes what it does to the TraceLog, so you can SEE the onion.
 * Code BEFORE next(req) runs on the way OUT; operators in next(req).pipe(...) run on the way BACK.
 *
 * TODO 1 loading:
 *   way out:  log 'loading:out'
 *   way back: finalize(() => log 'loading:finalize')   (runs after success, error AND cancel)
 */
export const traceLoading: HttpInterceptorFn = (req, next) => {
  return next(req);
};

/**
 * TODO 2 auth:
 *   way out:  log 'auth:out', then pass a CLONE with header Authorization: `Bearer ${TRACE_TOKEN}`
 *   way back: tap({ next: e => (only when e.type === HttpEventType.Response) log 'auth:back',
 *                   error: () => log 'auth:back-error' })
 *   (Interceptors see EVENTS, not just the body: first a "Sent" event, later the Response.)
 */
export const traceAuth: HttpInterceptorFn = (req, next) => {
  return next(req);
};

/**
 * TODO 3 unauthorized:
 *   way out:  log 'unauth:out'
 *   way back: catchError(err => { log `unauth:caught ${err.status}`; RETHROW: return throwError(() => err) })
 */
export const traceUnauthorized: HttpInterceptorFn = (req, next) => {
  return next(req);
};

/** TODO 4: the order of the onion, outermost first: loading, auth, unauthorized. */
export const TRACE_CHAIN: HttpInterceptorFn[] = [];
