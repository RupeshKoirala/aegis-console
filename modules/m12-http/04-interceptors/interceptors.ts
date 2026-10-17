import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RequestLog, SessionEvents, TenantContext } from './session';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
//@@sol
  if (req.headers.has('X-Correlation-Id')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Correlation-Id': crypto.randomUUID() } }));
//@@stub
  // TODO 1: unless the request already has X-Correlation-Id, clone it with setHeaders: { 'X-Correlation-Id': crypto.randomUUID() }
  return next(req);
//@@end
};

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
//@@sol
  const tenant = inject(TenantContext).actingFor();
  if (tenant === null || !req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Tenant-Id': String(tenant) } }));
//@@stub
  // TODO 2: inject(TenantContext).actingFor(); when it's not null AND the url starts with '/api/', add X-Tenant-Id (as a string)
  return next(req);
//@@end
};

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
//@@sol
  const session = inject(SessionEvents);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) session.expired.set(true);
      return throwError(() => err);
    }),
  );
//@@stub
  // TODO 3: inject SessionEvents BEFORE calling next (inject only works synchronously here!), then
  //         next(req).pipe(catchError(err => { if 401 → session.expired.set(true); return throwError(() => err); }))
  return next(req);
//@@end
};

/** Gen 1 class-based interceptor, registered with HTTP_INTERCEPTORS + withInterceptorsFromDi(). */
@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  private readonly log = inject(RequestLog);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = performance.now();
//@@sol
    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) this.log.add(`${req.method} ${req.urlWithParams} → ${event.status} in ${Math.round(performance.now() - started)} ms`);
        },
        error: (err: HttpErrorResponse) => this.log.add(`${req.method} ${req.urlWithParams} → ${err.status} in ${Math.round(performance.now() - started)} ms`),
      }),
    );
//@@stub
    // TODO 4: next.handle(req).pipe(tap({ next, error })) and add a line for the final response (event instanceof HttpResponse)
    //         and for errors: `${req.method} ${req.urlWithParams} → ${status} in ${ms} ms`
    return next.handle(req);
//@@end
  }
}
