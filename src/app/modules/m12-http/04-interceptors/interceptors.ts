import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RequestLog, SessionEvents, TenantContext } from './session';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 1: unless the request already has X-Correlation-Id, clone it with setHeaders: { 'X-Correlation-Id': crypto.randomUUID() }
  return next(req);
};

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 2: inject(TenantContext).actingFor(); when it's not null AND the url starts with '/api/', add X-Tenant-Id (as a string)
  return next(req);
};

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO 3: inject SessionEvents BEFORE calling next (inject only works synchronously here!), then
  //         next(req).pipe(catchError(err => { if 401 → session.expired.set(true); return throwError(() => err); }))
  return next(req);
};

/** Gen 1 class-based interceptor, registered with HTTP_INTERCEPTORS + withInterceptorsFromDi(). */
@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  private readonly log = inject(RequestLog);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = performance.now();
    // TODO 4: next.handle(req).pipe(tap({ next, error })) and add a line for the final response (event instanceof HttpResponse)
    //         and for errors: `${req.method} ${req.urlWithParams} → ${status} in ${ms} ms`
    return next.handle(req);
  }
}
