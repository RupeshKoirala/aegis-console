import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
//@@sol
import { catchError, finalize, tap, throwError } from 'rxjs';
//@@end
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
//@@sol
  const log = inject(TraceLog);
  log.add('loading:out');
  return next(req).pipe(finalize(() => log.add('loading:finalize')));
//@@stub
  return next(req);
//@@end
};

/**
 * TODO 2 auth:
 *   way out:  log 'auth:out', then pass a CLONE with header Authorization: `Bearer ${TRACE_TOKEN}`
 *   way back: tap({ next: e => (only when e.type === HttpEventType.Response) log 'auth:back',
 *                   error: () => log 'auth:back-error' })
 *   (Interceptors see EVENTS, not just the body: first a "Sent" event, later the Response.)
 */
export const traceAuth: HttpInterceptorFn = (req, next) => {
//@@sol
  const log = inject(TraceLog);
  log.add('auth:out');
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${TRACE_TOKEN}` } })).pipe(
    tap({
      next: e => {
        if (e.type === HttpEventType.Response) log.add('auth:back');
      },
      error: () => log.add('auth:back-error'),
    }),
  );
//@@stub
  return next(req);
//@@end
};

/**
 * TODO 3 unauthorized:
 *   way out:  log 'unauth:out'
 *   way back: catchError(err => { log `unauth:caught ${err.status}`; RETHROW: return throwError(() => err) })
 */
export const traceUnauthorized: HttpInterceptorFn = (req, next) => {
//@@sol
  const log = inject(TraceLog);
  log.add('unauth:out');
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      log.add(`unauth:caught ${err.status}`);
      return throwError(() => err);
    }),
  );
//@@stub
  return next(req);
//@@end
};

/** TODO 4: the order of the onion, outermost first: loading, auth, unauthorized. */
//@@sol
export const TRACE_CHAIN: HttpInterceptorFn[] = [traceLoading, traceAuth, traceUnauthorized];
//@@stub
export const TRACE_CHAIN: HttpInterceptorFn[] = [];
//@@end
